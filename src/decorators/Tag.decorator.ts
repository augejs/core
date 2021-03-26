/* eslint-disable @typescript-eslint/ban-types */

import { Metadata } from '@augejs/provider-scanner';
export function Tag(name: string): ClassDecorator {
  return function(target: NewableFunction) {
    Tag.defineMetadata(target, name);
  }
}

Tag.hasMetadata = (target: object): boolean => {
  return Metadata.hasMetadata(Tag, target)
}

Tag.defineMetadata = (target: object, name: string)=> {
  Metadata.defineInsertEndArrayMetadata(Tag, [ name ], target);
}

Tag.getMetadata = (target: object): string[] => {
  return Metadata.getMetadata(Tag, target) as string[] || [];
}
