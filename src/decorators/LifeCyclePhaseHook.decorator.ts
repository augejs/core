import { IScanNode, Metadata, hookUtil, HookMetadata } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';
import { ScanInputKeys } from '../constants';
export function LifeCyclePhaseHook (lifeCyclePhase:string, hooks: Function | Function[]):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      ScanHook(
        async (scanNode: IScanNode, next: Function)=> {
          const hook:Function = hookUtil.bindHookContext(scanNode, hookUtil.sequenceHooks(hooks));
          const hookTarget:object = scanNode.context!.inputs.get(ScanInputKeys.LifeCyclePhase)[lifeCyclePhase];
          HookMetadata.defineMetadata(hookTarget, hook);
          next();
        }
      )
    ], target);
  }
}


