import { Metadata } from '@augejs/provider-scanner';
export function Tag(name: string): ClassDecorator {
  return function(target: Function) {
    Tag.defineMetadata(target, name);
  }
}

Tag.hasMetadata = (target: Object): boolean => {
  return Metadata.hasMetadata(Tag, target)
}

Tag.defineMetadata = (target: Object, name: string)=> {
  Metadata.defineInsertEndArrayMetadata(Tag, [ name ], target);
}

Tag.getMetadata = (target: object): string[] => {
  return Metadata.getMetadata(Tag, target) || [];
}
