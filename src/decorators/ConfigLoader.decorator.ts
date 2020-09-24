import { Metadata } from '@augejs/provider-scanner';

const noopLoader = () => {};

export function ConfigLoader (loader: Function):ClassDecorator {
  return function(target: Function) {
    ConfigLoader.defineMetadata(target, loader);
  }
}

ConfigLoader.defineMetadata = (target: object, loader: Function)=> {
  Metadata.defineMetadata(ConfigLoader, loader, target);
}

ConfigLoader.getMetadata = (target: object):Function => {
  return Metadata.getMetadata(ConfigLoader, target) || noopLoader;
}
