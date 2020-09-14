import { HookMetadata } from '@augejs/provider-scanner';
export function ScanHook (hooks: Function | Function[]):ClassDecorator {
  return function(target: Function) {
    ScanHook.defineMetadata(target, hooks);
  }
}

ScanHook.defineMetadata = (target: object, hooks: Function | Function[]) => {
  HookMetadata.defineMetadata(target, hooks);
}

ScanHook.getMetadata = (target: object): Function[] => {
  return HookMetadata.getMetadata(target);
}

