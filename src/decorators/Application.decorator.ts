import { argv } from 'yargs';
import { HookMetadata, hookUtil, IScanNode, Metadata } from '@augejs/provider-scanner';
import { Module, IModuleOptions } from './Module.decorator';
import { ScanHook } from './ScanHook.decorator';
import { Container, BindingScopeEnum } from '../ioc';
import { ScanInputKeys, ScanOutputKeys } from '../constants';
import { getConfigAccessPath, objectExtend, objectPath } from '../utils';
import { ILogger, Logger } from '../logger';

const logger:ILogger = Logger.getLogger('App');

type LifeCycleOptions = {
  startupLifecycleNames: string[],
  shutdownLifecycleNames: string[],
}

const DefaultLifeCycleConfig: LifeCycleOptions =
{
  startupLifecycleNames:  [
    'onInit', 'onAppWillReady', '__onAppReady__', 'onAppDidReady'
  ],
  shutdownLifecycleNames: [
    'onAppWillClose',
  ]
};

export interface IAppOptions extends IModuleOptions {
  containerOptions?:object
}

export function Application (options?: IAppOptions):ClassDecorator {
  return function(target: Function) {
    const containerOptions = {
      defaultScope: BindingScopeEnum.Singleton,
      autoBindInjectable: false,
      skipBaseClassChecks: true,
      ...(options?.containerOptions || {})
    };
    Metadata.decorate([
      Module({
        providers: options?.providers,
        subModules: options?.subModules,
        hooks: options?.hooks,
      }),
      ScanHook([
        createInitEnvironmentHook(containerOptions),
        createLifeCycleHook(DefaultLifeCycleConfig),
      ]),
    ], target);
  }
}

function createInitEnvironmentHook(containerOptions:object):Function {
  return async function (scanNode: IScanNode, next: Function) {
    // set for ioc container
    scanNode.context!.inputs.set(ScanInputKeys.Container, new Container(containerOptions));
    // set for process args
    scanNode.context!.inputs.set(ScanInputKeys.ProcessArgs, argv);

    const runtimeConfig:object = {};
    scanNode.context!.outputs.set(ScanOutputKeys.RuntimeConfig, runtimeConfig);
    scanNode.context!.outputs.set(ScanOutputKeys.StartUpHookTarget, {});
    scanNode.context!.outputs.set(ScanOutputKeys.ShutDownHookTarget, {});

    await next();

    objectExtend<object, object>(true, runtimeConfig, argv);
  }
}

function createLifeCycleHook(lifeCycleOptions:LifeCycleOptions):Function {
  return async function lifeCycleHook(scanNode: IScanNode, next: Function) {
    await next();

    const { startupLifecycleNames, shutdownLifecycleNames } = lifeCycleOptions;

    // startup
    const startUpLifeCyclesHook:Function = hookUtil.sequenceHooks(startupLifecycleNames.map((lifeCycleName:string) => {
      return buildScanNodeInstanceLifeCycleHook(scanNode, lifeCycleName);
    }));

    const startUpHookTarget:object = scanNode.context!.outputs.get(ScanOutputKeys.StartUpHookTarget);
    const startUpSelfHook:Function = hookUtil.parallelHooks(HookMetadata.getMetadata(startUpHookTarget));
    const startUpHook:Function = hookUtil.sequenceHooks([
      startUpLifeCyclesHook,
      startUpSelfHook
    ]);
    try {
      await startUpHook(scanNode);
    } catch(err:any) {
      logger.error('StartUp Error \n' + err);
    }
    //shutdown
    // https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357
    // https://blog.risingstack.com/graceful-shutdown-node-js-kubernetes/

    const shutDownLifeCyclesHook:Function = hookUtil.sequenceHooks(shutdownLifecycleNames.map((lifeCycleName:string) => {
      return buildScanNodeInstanceLifeCycleHook(scanNode, lifeCycleName);
    }));
    const shutDownTarget:object = scanNode.context!.outputs.get(ScanOutputKeys.ShutDownHookTarget);
    const shutDownSelfHook:Function = hookUtil.parallelHooks(HookMetadata.getMetadata(shutDownTarget));
    const shutDownHook:Function = hookUtil.sequenceHooks([
      shutDownLifeCyclesHook,
      shutDownSelfHook
    ]);

    process.on('exit', () => {
      (async () => {
        try {
          await shutDownHook(scanNode);
        } catch(err:any) {
          logger.error('ShutDown Error \n' + err);
        }
      })()
    })
  }
}

function buildScanNodeInstanceLifeCycleHook(scanNode: IScanNode, lifecycleName: string):Function {
  let selfLifeCycleHook:Function = hookUtil.noopHook;
  let instance:any = scanNode.outputs.get(ScanOutputKeys.Instance);
  if (instance === undefined) {
    const instanceFactory:Function | undefined = scanNode.outputs.get(ScanOutputKeys.InstanceFactory);
    if (instanceFactory) {
      // set the instance config
      const configAccessPath:string = getConfigAccessPath(scanNode.namePaths);
      const runtimeConfig:object = scanNode.context!.outputs.get(ScanOutputKeys.RuntimeConfig);
      const scanNodeConfig:any = objectPath.get(runtimeConfig, configAccessPath);
      scanNode.outputs.set(ScanOutputKeys.InstanceConfig, scanNodeConfig);
      instance = instanceFactory();
    } else {
      instance = null;
    }
    scanNode.outputs.set(ScanOutputKeys.Instance, instance);
  }

  // add  self life cycle
  if (instance) {
    // keep the reference to scanNode
    instance.$scanNode = scanNode;
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
