import { NameMetadata } from '@augejs/provider-scanner';

export function Name(name?: string): ClassDecorator {
  return function(target: Function) {
    Name.defineMetadata(target, name);
  }
}

Name.defineMetadata = (target: object, name?: string) => {
  NameMetadata.defineMetadata(target, name);
}

Name.getMetadata = (target: object): string => {
  return NameMetadata.getMetadata(target);
}

