import { IScanNode, Metadata, HookMetadata, hookUtil } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';
import { ScanOutputKeys } from '../constants';
export function StartUpHook (hooks: Function | Function[]):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      ScanHook(
        async (scanNode: IScanNode, next: Function)=> {
          const hook:Function = hookUtil.bindHookContext(scanNode, hookUtil.sequenceHooks(hooks));
          const startUpHookTarget:object = scanNode.context!.outputs.get(ScanOutputKeys.StartUpHookTarget);
          HookMetadata.defineMetadata(startUpHookTarget, hook);
          next();
        }
      )
    ], target);
  }
}
