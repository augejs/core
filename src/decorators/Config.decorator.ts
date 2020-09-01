
import { Metadata } from '@augejs/provider-scanner';

export function Config (value:object):ClassDecorator {
  return function(target: Function) {
    Config.defineMetadata(target, value);
  }
}

Config.defineMetadata = (target: object, config: object)=> {
  if (typeof config === 'function') {
    Metadata.defineMetadata(Config, config, target);
  } else {
    Metadata.defineMergeObjectMetadata(Config, config, target);
  }
}

Config.getMetadata = (target: object):object => {
  return Metadata.getMetadata(Config, target) || {};
}
