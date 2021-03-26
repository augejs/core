/* eslint-disable @typescript-eslint/ban-types */

import { Metadata } from '@augejs/provider-scanner';

export function Config (value:object):ClassDecorator {
  return function(target: Function) {
    Config.defineMetadata(target, value);
  }
}

Config.defineMetadata = (target: object, config: object)=> {
  Metadata.defineMergeObjectMetadata(Config, config, target);
}

Config.getMetadata = (target: object):object => {
  return Metadata.getMetadata(Config, target) as object ?? {};
}
