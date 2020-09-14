import { Metadata, hookUtil, HookMetadata } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';
import { IScanNode } from '../utils';

export function LifeCyclePhaseHook (lifeCyclePhase:string, hooks: Function | Function[]):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      ScanHook(
        async (scanNode: IScanNode, next: Function)=> {
          const hook:Function = hookUtil.bindHookContext(scanNode, hookUtil.sequenceHooks(hooks));
          const hookTarget:object = scanNode.context.lifeCyclePhaseNodes[lifeCyclePhase];
          HookMetadata.defineMetadata(hookTarget, hook);
          next();
        }
      )
    ], target);
  }
}


