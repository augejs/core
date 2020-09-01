import { NameMetadata } from '@augejs/provider-scanner';
export function Name(name?: string): ClassDecorator {
  return function(target: Function) {
    NameMetadata.defineMetadata(target, name);
  }
}
