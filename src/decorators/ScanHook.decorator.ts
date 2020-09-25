import { HookFunction, HookMetadata } from '@augejs/provider-scanner';
export function ScanHook (hooks: HookFunction | HookFunction[]):ClassDecorator {
  return function(target: Function) {
    ScanHook.defineMetadata(target, hooks);
  }
}

ScanHook.defineMetadata = (target: object, hooks: HookFunction | HookFunction[]) => {
  HookMetadata.defineMetadata(target, hooks);
}

ScanHook.getMetadata = (target: object): HookFunction[] => {
  return HookMetadata.getMetadata(target);
}

