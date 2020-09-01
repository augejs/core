import { HookMetadata } from '@augejs/provider-scanner';
export function ScanHook (hooks: Function | Function[]):ClassDecorator {
  return function(target: Function) {
    HookMetadata.defineMetadata(target, hooks);
  }
}
