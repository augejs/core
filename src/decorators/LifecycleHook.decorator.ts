import { Metadata, hookUtil, HookMetadata } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';
import { IScanNode } from '../utils';

export function LifeCycleHook (lifecycleName:string, hooks: Function | Function[]):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      ScanHook(
        async (scanNode: IScanNode, next: Function)=> {
          const hook:Function = hookUtil.bindHookContext(scanNode, hookUtil.nestHooks(hooks));
          const hookTarget:object = scanNode.lifeCycleNodes[lifecycleName];
          HookMetadata.defineMetadata(hookTarget, hook);
          next();
        }
      )
    ], target);
  }
}

export function ApplicationLifeCycleHook (lifecycleName:string, hooks: Function | Function[]):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      ScanHook(
        async (scanNode: IScanNode, next: Function)=> {
          const hook:Function = hookUtil.bindHookContext(scanNode, hookUtil.nestHooks(hooks));
          const hookTarget:object = scanNode.context.rootScanNode!.lifeCycleNodes[lifecycleName];
          HookMetadata.defineMetadata(hookTarget, hook);
          next();
        }
      )
    ], target);
  }
}



