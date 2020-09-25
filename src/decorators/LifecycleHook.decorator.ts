import { Metadata, hookUtil, HookMetadata } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';
import { IScanNode } from '../utils';

export function LifecycleHook (lifecycleName:string, hooks: Function | Function[]):ClassDecorator {
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

export function LifecycleOnInitHook(hooks: Function | Function[]): ClassDecorator {
  return LifecycleHook("onInit", hooks);
}

export function LifecycleOnAppWillReadyHook(hooks: Function | Function[]): ClassDecorator {
  return LifecycleHook("onAppWillReady", hooks);
}

export function LifecycleOnAppDidReadyHook(hooks: Function | Function[]): ClassDecorator {
  return LifecycleHook("onAppDidReady", hooks);
}

export function Lifecycle__onAppReady__Hook(hooks: Function | Function[]): ClassDecorator {
  return LifecycleHook("__onAppReady__", hooks);
}

export function LifecycleOnAppWillCloseyHook(hooks: Function | Function[]): ClassDecorator {
  return LifecycleHook("onAppWillClose", hooks);
}







