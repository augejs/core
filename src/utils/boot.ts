import { argv } from 'yargs';
import { scan, IScanNode, IScanContext, hookUtil, HookMetadata } from '@augejs/provider-scanner';
import { getConfigAccessPath } from './config.util';
import { objectPath, objectExtend } from './object.util';
import { BindingScopeEnum, Container } from '../ioc';
import { Config, ConfigLoader } from '../decorators';
import { ILogger, Logger, ConsoleLogTransport } from '../logger';

const DefaultLifeCyclePhases =
{
  startupLifecyclePhase:  [
    'onInit', 'onAppWillReady', '__onAppReady__'
  ],

  readyLifecyclePhase: [
    'onAppDidReady',
  ],

  shutdownLifecyclePhase: [
    'onAppWillClose',
  ]
};

interface IBootOptions {
  containerOptions?: { [key: string]: any}
  lifeCyclePhases?: { [key: string]: string[]}
}

const logger:ILogger = Logger.getLogger('Boot');

export const boot = async (appModule:Function, options?:IBootOptions): Promise<IScanContext> => {
  const containerOptions = {
    defaultScope: BindingScopeEnum.Singleton,
    autoBindInjectable: false,
    skipBaseClassChecks: true,
    ...(options?.containerOptions || {})
  };

  const lifeCyclePhases = options?.lifeCyclePhases || DefaultLifeCyclePhases;

  return await scan(appModule, {
    // context level hooks.
    contextScanHook: hookUtil.nestHooks([
      // setup the boot env
      async function setupEnvHook(context: IScanContext, next: Function) {
        context.container = new Container(containerOptions);
        context.processArgv = argv;
        context.globalConfig = {};
        objectExtend<object, object>(true, context.globalConfig, argv);
        context.lifeCyclePhaseNodes = {};
        Object.keys(lifeCyclePhases).forEach((lifeCyclePhaseName: string) => {
          context.lifeCyclePhaseNodes[lifeCyclePhaseName] = {};
        });
        await next();
      },

      async function setupConfig(context: IScanContext, next: Function) {
        await hookUtil.traverseTreeNodeHook(context.rootScanNode!, async (scanNode: IScanNode, next: Function)=> {
          await next();
          const configAccessPath:string = getConfigAccessPath(scanNode.namePaths);
          const globalConfig:object = scanNode.context.globalConfig;
          // helper to get config
          scanNode.getConfig = (path?:string): any => {
            const configAccessPath:string = getConfigAccessPath(scanNode.namePaths, path);
            return objectPath.get(globalConfig, configAccessPath);
          }
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
        })(context);
        // the argv has highest priority
        objectExtend<object, object>(true, context.globalConfig, argv);
        await next();
      },

      async function setupLfeCyclePhasesHook(context: IScanContext, next: Function) {
        await next();
        const rootScanNode:IScanNode = context.rootScanNode!;
        const lifeCyclePhasesHookMap:{ [key: string]: Function} = {};

        Object.keys(lifeCyclePhases).forEach((lifeCyclePhaseName: string) => {
          const lifeCycleNames:string[] = lifeCyclePhases[lifeCyclePhaseName];
          const childrenHook:Function = hookUtil.sequenceHooks(lifeCycleNames.map((lifeCycleName:string) => {
            return buildScanNodeInstanceLifeCycleHook(rootScanNode, lifeCycleName);
          }));

          const selfHook:Function = hookUtil.parallelHooks(HookMetadata.getMetadata(context.lifeCyclePhaseNodes[lifeCyclePhaseName]));
          lifeCyclePhasesHookMap[lifeCyclePhaseName] = hookUtil.sequenceHooks([
            childrenHook,
            selfHook
          ]);
        });

        // startup
        try {
          await lifeCyclePhasesHookMap.startupLifecyclePhase(rootScanNode);
        } catch(err) {
          logger.error(`startupLifecyclePhase Error \n  ${err} \n ${err?.stack}`);
        }

        process.nextTick(() => {
          (async () => {
            try {
              await lifeCyclePhasesHookMap.readyLifecyclePhase(rootScanNode);

              // if here there is no LogTransport, add ConsoleLogTransport as default.
              if (Logger.getTransportCount() === 0) {
                Logger.addTransport(new ConsoleLogTransport());
              }
            } catch(err) {
              logger.error(`readyLifecyclePhase Error \n  ${err} \n ${err?.stack}`);
            }
          })();
        })

        //shutdown
        // https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
        // https://blog.risingstack.com/graceful-shutdown-node-js-kubernetes/
        process.on('exit', () => {
          (async () => {
            try {
              await lifeCyclePhasesHookMap.shutdownLifecyclePhase(rootScanNode);
            } catch(err:any) {
              logger.error('ShutDown Error \n' + err);
            }
          })()
        })
      }
    ]),
    // scanNode level hooks.
    scanNodeScanHook: hookUtil.nestHooks([
      async function setupScanNodeDIHook(scanNode: IScanNode, next: Function) {
        const container:Container = scanNode.context.container;

        let instanceFactory:Function | null = null;
        const provider:any = scanNode.provider;
        // here we need deal with kinds of provider value.
        if (typeof provider === 'function') {
          container.bind(provider).toSelf();
          instanceFactory = () => {
            return container.get(provider);
          }
        } else if (typeof provider === 'object') {
          // https://github.com/inversify/InversifyJS#the-inversifyjs-features-and-api
          if (Object.prototype.hasOwnProperty.call(provider, 'id') && !!provider.id) {
            const identifier:any = provider.id;
            if (Object.prototype.hasOwnProperty.call(provider, 'useValue')) {
              container.bind(identifier).toConstantValue(provider.useValue);
              instanceFactory = () => {
                return container.get(identifier);
              }
            } else if (Object.prototype.hasOwnProperty.call(provider, 'useClass')) {
              container.bind(identifier).to(provider.useClass);
              instanceFactory = () => {
                return container.get(identifier);
              }
            } else if (Object.prototype.hasOwnProperty.call(provider, 'useFactory')) {
              container.bind(identifier).toDynamicValue(()=>{
                return provider.useFactory(scanNode.parent);
              });
              instanceFactory = () => {
                return container.get(identifier);
              }
            } else if (Object.prototype.hasOwnProperty.call(provider, 'useExisting')) {
              container.bind(identifier).toDynamicValue(()=>{
                return container.get(identifier);
              });
            }
          }
        }

        await next();

        let instance:any = null;
        if (instanceFactory) {
          instance = await instanceFactory();
        }
        scanNode.instance = instance;
        // add  self life cycle
        if (instance) {
          // keep the reference to scanNode
          instance.$scanNode = scanNode;
        }
      }
    ]),
  });
};

function buildScanNodeInstanceLifeCycleHook(scanNode: IScanNode, lifecycleName: string):Function {
  let selfLifeCycleHook:Function = hookUtil.noopHook;
  let instance:any = scanNode.instance
  if (instance) {
    // bind the life cycle
    if(typeof instance[lifecycleName] === 'function') {
      selfLifeCycleHook = (instance[lifecycleName] as Function).bind(instance);
    }
  }

  // build the children life cycle
  const childrenLifeCycleHook:Function = hookUtil.parallelHooks(
    scanNode.children.map((child:IScanNode) => {
      return buildScanNodeInstanceLifeCycleHook(child, lifecycleName);
    })
  )

  // children life cycle first
  return hookUtil.bindHookContext(scanNode, hookUtil.sequenceHooks([
    childrenLifeCycleHook,
    selfLifeCycleHook,
  ]));
}

