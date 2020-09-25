import { Metadata, HookMetadata, HookFunction } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';
import { IScanNode } from '../utils';

export function LifecycleHook (lifecycleName:string, hooks: HookFunction | HookFunction[]):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      ScanHook(
        async (scanNode: IScanNode, next: Function)=> {
          HookMetadata.defineMetadata(scanNode.lifeCycleNodes[lifecycleName], hooks);
          await next();
        }
      )
    ], target);
  }
}

export function LifecycleOnInitHook(hooks: HookFunction | HookFunction[]): ClassDecorator {
  return LifecycleHook("onInit", hooks);
}

export function LifecycleOnAppWillReadyHook(hooks: HookFunction | HookFunction[]): ClassDecorator {
  return LifecycleHook("onAppWillReady", hooks);
}

export function LifecycleOnAppDidReadyHook(hooks: HookFunction | HookFunction[]): ClassDecorator {
  return LifecycleHook("onAppDidReady", hooks);
}

export function Lifecycle__onAppReady__Hook(hooks: HookFunction | HookFunction[]): ClassDecorator {
  return LifecycleHook("__onAppReady__", hooks);
}

export function LifecycleOnAppWillCloseHook(hooks: HookFunction | HookFunction[]): ClassDecorator {
  return LifecycleHook("onAppWillClose", hooks);
}







