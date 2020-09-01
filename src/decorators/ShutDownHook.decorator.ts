import { IScanNode, Metadata, hookUtil, HookMetadata } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';
import { ScanOutputKeys } from '../constants';
export function ShutDownHook (hooks: Function | Function[]):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      ScanHook(
        async (scanNode: IScanNode, next: Function)=> {
          const hook:Function = hookUtil.bindHookContext(scanNode, hookUtil.sequenceHooks(hooks));
          const shutDownHookTarget:object = scanNode.context!.outputs.get(ScanOutputKeys.ShutDownHookTarget);
          HookMetadata.defineMetadata(shutDownHookTarget, hook);
          next();
        }
      )
    ], target);
  }
}


