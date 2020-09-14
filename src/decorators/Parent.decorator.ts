import { ParentMetadata } from '@augejs/provider-scanner';

export function Parent(children: object[]):ClassDecorator {
  return (target: Function) => {
    Parent.defineMetadata(target, children);
  }
}

Parent.defineMetadata = (target: object, children: any[]) => {
  ParentMetadata.defineMetadata(target, children);
}

Parent.getMetadata = (target: object): object[] => {
  return ParentMetadata.getMetadata(target);
}






