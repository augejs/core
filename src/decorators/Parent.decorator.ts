import { ParentMetadata } from '@augejs/provider-scanner';

export function Parent(children: object[]):ClassDecorator {
  return function(target: Function) {
    ParentMetadata.defineMetadata(target, children);
  }
}
