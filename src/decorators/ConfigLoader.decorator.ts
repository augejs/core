import { Metadata } from '@augejs/provider-scanner';
import { IScanNode } from '../utils';

const noopLoader = () => {};

export function ConfigLoader (loader: (config:object, scanNode:IScanNode)=>Promise<object>):ClassDecorator {
  return function(target: Function) {
    ConfigLoader.defineMetadata(target, loader);
  }
}

ConfigLoader.defineMetadata = (target: object, loader: (config:object, scanNode:IScanNode)=>Promise<object>)=> {
  Metadata.defineMetadata(ConfigLoader, loader, target);
}

ConfigLoader.getMetadata = (target: object):Function => {
  return Metadata.getMetadata(ConfigLoader, target) || noopLoader;
}
