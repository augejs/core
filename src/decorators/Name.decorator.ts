/* eslint-disable @typescript-eslint/ban-types */
import { NameMetadata } from '@augejs/provider-scanner';

export function Name(name?: string): ClassDecorator {
  return function(target: NewableFunction) {
    Name.defineMetadata(target, name);
  }
}

Name.defineMetadata = (target: object, name?: string) => {
  NameMetadata.defineMetadata(target, name);
}

Name.getMetadata = (target: object): string => {
  return NameMetadata.getMetadata(target);
}

