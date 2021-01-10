import cluster from 'cluster';
import yargsParse from 'yargs-parser';

import { scan, IScanNode, IScanContext, hookUtil, HookMetadata, Metadata } from '@augejs/provider-scanner';
import { getConfigAccessPath } from './config.util';
import { objectPath, objectExtend } from './object.util';
import { BindingScopeEnum, Container } from '../ioc';
import { Cluster, Config, ConfigLoader, Tag } from '../decorators';
import { ILogger, Logger, ConsoleLogTransport } from '../logger';

const DefaultLifeCyclePhases =
{
  startupLifecyclePhase:  [
    'onInit',
    'onAppWillReady',
    '__onAppReady__',
  ],

  readyLifecyclePhase: [
    'onAppDidReady',
  ],

  shutdownLifecyclePhase: [
    'onAppWillClose',
  ]
};

interface IBootOptions {
  containerOptions?: Record<string, any>,
  config?: Record<string, any>,
}

const logger:ILogger = Logger.getLogger('boot');

export const boot = async (appModule:Function, options?:IBootOptions): Promise<IScanContext> => {
  if (cluster.isMaster && Cluster.hasMetadata(appModule)) {
    const clusterOptions = Cluster.getMetadata(appModule);
    if (clusterOptions.enable) {
      const clusterModule = clusterOptions.clusterModule || Cluster.DefaultClusterModule;
      Metadata.decorate([
        Cluster.ClusterMasterClassDecorator({
          workers: clusterOptions.workers,
        })
      ], clusterModule);
      appModule = clusterModule;
    }
  }

  return await scan(appModule, {
    // context level hooks.
    contextScanHook: hookUtil.nestHooks([
      async (context: IScanContext, next: Function) => {
        try {
          await next();
        } catch(err) {
          logger.error(`boot Error \n ${err?.stack || err?.message || err}`);
          // add default log transport.
          if (Logger.getTransportCount() === 0) {
            Logger.addTransport(new ConsoleLogTransport());
          }
          process.exit(1);
        }
      },
      bootLifeCyclePhases(),
      bootSetupEnv(options),
      bootLoadConfig(options),
      bootIoc(),
    ]),
    scanNodeScanHook: scanNodeInstantiation(),
  });
};

function bootSetupEnv(options?:IBootOptions) {
  const containerOptions = {
    defaultScope: BindingScopeEnum.Singleton,
    autoBindInjectable: false,
    skipBaseClassChecks: true,
    ...(options?.containerOptions || {})
  };
  const lifeCycleNames: string[] = Object.values(DefaultLifeCyclePhases).flat();
  return async (context: IScanContext, next: Function) => {
    // define context
    context.container = new Container(containerOptions);
    context.globalConfig = {};
    context.lifeCyclePhasesHooks = {};
    context.getScanNodeByProvider = (provider: object): IScanNode=> {
      return Metadata.getMetadata(provider, provider) as IScanNode;
    }
    await hookUtil.traverseScanNodeHook(
      context.rootScanNode!,
      (scanNode: IScanNode) => {
        // bind the provider to scanNode.
        Metadata.defineMetadata(scanNode.provider, scanNode, scanNode.provider);
        // lifecycle
        scanNode.lifeCycleNodes = {};
        lifeCycleNames.forEach((lifeCycleName: string) => {
          scanNode.lifeCycleNodes[lifeCycleName] = {};
        });
        scanNode.getConfig = (path?:string): any => {
          const configAccessPath:string = getConfigAccessPath(scanNode.namePaths, path);
          return objectPath.get(scanNode.context.globalConfig, configAccessPath);
        }
        return null;
      },
      hookUtil.sequenceHooks
    )(null);
    await next();
  }
}

function bootLoadConfig(options?:IBootOptions) {
  return async (context: IScanContext, next: Function) => {
    await hookUtil.traverseScanNodeHook(
      context.rootScanNode!,
      () => {
        return async (scanNode: IScanNode, next: Function)=> {
          await next();
          const configAccessPath:string = getConfigAccessPath(scanNode.namePaths);
          const globalConfig:object = scanNode.context.globalConfig;
          // provide config.
          // https://www.npmjs.com/package/object-path
          let providerConfig:object = Config.getMetadata(scanNode.provider);
          const providerConfigLoader:Function = ConfigLoader.getMetadata(scanNode.provider);
          const providerConfigLoaderConfigResult:any = await providerConfigLoader(scanNode);
          if (providerConfigLoaderConfigResult !== undefined) {
            objectExtend<object, object>(true, providerConfig, providerConfigLoaderConfigResult);
          }
          // current override previous
          let preProviderConfig:any = objectPath.get(globalConfig, configAccessPath);
          if (preProviderConfig) {
            objectExtend<object, object>(true, preProviderConfig, providerConfig);
          } else {
            preProviderConfig = providerConfig;
          }
          // https://www.npmjs.com/package/extend
          objectPath.set<object>(globalConfig, configAccessPath, preProviderConfig);
        }
      }, hookUtil.nestHooks
    )(null);

    // the external global config has highest priority
    objectExtend<object, object>(true, context.globalConfig, {
      ...(options?.config || yargsParse(process.argv.slice(2)))
    });
    await next();
  }
}

function bootIoc() {
  return async (context: IScanContext, next: Function) => {
    await hookUtil.traverseScanNodeHook(
      context.rootScanNode!,
      () => {
        return async (scanNode: IScanNode, next: Function) => {
          const container:Container = scanNode.context.container;
          const provider:any = scanNode.provider;
          // here we need deal with kinds of provider value.
          if (typeof provider === 'function') {
            container.bind(provider).toSelf();
            scanNode.instanceFactory = () => {
              return container.get(provider);
            }
          } else if (typeof provider === 'object') {
            // https://github.com/inversify/InversifyJS#the-inversifyjs-features-and-api
            const identifier:any = provider?.id;
            if (identifier) {
              if (provider.useValue) {
                container.bind(identifier).toConstantValue(provider.useValue);
                scanNode.instanceFactory = ()=>{
                  return container.get(identifier);
                }
              } else if (typeof provider.useClass === 'function') {
                container.bind(identifier).to(provider.useClass);
                scanNode.instanceFactory = ()=>{
                  return container.get(identifier);
                }
              } else if (typeof provider.useFactory === 'function') {
                const factoryResult = await provider.useFactory(container, scanNode.parent);
                if (factoryResult) {
                  if (typeof factoryResult === 'function') {
                    container.bind(identifier).to(factoryResult);
                    scanNode.instanceFactory = ()=>{
                      return container.get(identifier);
                    }
                  } else {
                    container.bind(identifier).toConstantValue(factoryResult);
                    scanNode.instanceFactory = ()=>{
                      return container.get(identifier);
                    }
                  }
                }
              }
            }
          }
          await next();
        }
      }, hookUtil.nestReversedHooks
    )(null);
    await next();
  }
}

function scanNodeInstantiation() {
  return async (scanNode: IScanNode, next: Function)=> {
    await next();
    let instance:any = null;
    const instanceFactory = scanNode.instanceFactory;
    if (instanceFactory) {
      instance = await instanceFactory();
    }
    scanNode.instance = instance;
    // add  self life cycle
    if (instance) {
      // keep the reference to scanNode
      instance.$scanNode = scanNode;
      // here is tags in constructor
      if (Tag.hasMetadata(scanNode.provider)) {
        Tag.getMetadata(scanNode.provider).forEach((tag: string) => {
          scanNode.context.container.bind(tag).toConstantValue(instance);
        });
      }
    }
  }
}

function bootLifeCyclePhases() {
  const lifeCyclePhases: {[key: string]: string[]} = DefaultLifeCyclePhases;
  return async (context: IScanContext, next: Function) => {
    await next();
    // last step
    Object.keys(lifeCyclePhases).forEach((lifeCyclePhaseName: string) => {
      const lifeCycleNames:string[] = lifeCyclePhases[lifeCyclePhaseName];
      context.lifeCyclePhasesHooks[lifeCyclePhaseName] = hookUtil.sequenceHooks(lifeCycleNames.map((lifecycleName:string) => {
        return hookUtil.traverseScanNodeHook(
          context.rootScanNode!,
          (scanNode: IScanNode) => {
            const instance:any = scanNode.instance;
            const hasLifecycleFunction: boolean = instance && typeof instance[lifecycleName] === 'function';
            return hookUtil.nestHooks([
              ...HookMetadata.getMetadata(scanNode.lifeCycleNodes[lifecycleName]),
              async (scanNode: IScanNode, next:Function) => {
                if (hasLifecycleFunction) {
                  await instance[lifecycleName](scanNode);
                }
                await next();
              }
            ]);
          }, hookUtil.nestReversedHooks);
      }));
    });

    const lifeCyclePhasesHooks: {[key: string]: Function} = context.lifeCyclePhasesHooks;

    await lifeCyclePhasesHooks.startupLifecyclePhase();
    process.nextTick(async () => {
      try {
        // add default log transport.
        if (Logger.getTransportCount() === 0) {
          Logger.addTransport(new ConsoleLogTransport());
        }
        // report the container self is ready
        process.send?.({cmd: '__onAppReady__'});

        await lifeCyclePhasesHooks.readyLifecyclePhase();
      } catch(err:any) {
        logger.error(`Ready Error \n ${err?.stack || err?.message || err}`);
      }
    })

    //shutdown
    // https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
    // https://blog.risingstack.com/graceful-shutdown-node-js-kubernetes/
    process.once('SIGTERM', async () => {
      try {
        await lifeCyclePhasesHooks.shutdownLifecyclePhase();
      } catch(err:any) {
        logger.error(`ShutDown Error \n ${err?.stack || err?.message || err}`);
      }
      process.exit();
    })
  }
}
