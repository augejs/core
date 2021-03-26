/* eslint-disable @typescript-eslint/ban-types */
import { ParentMetadata } from '@augejs/provider-scanner';

export function Parent(children: object[]):ClassDecorator {
  return (target: NewableFunction) => {
    Parent.defineMetadata(target, children);
  }
}

Parent.defineMetadata = (target: object, children: object[]) => {
  ParentMetadata.defineMetadata(target, children);
}

Parent.getMetadata = (target: object): object[] => {
  return ParentMetadata.getMetadata(target);
}






