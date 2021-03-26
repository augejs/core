/* eslint-disable @typescript-eslint/ban-types */
import { Metadata } from '@augejs/provider-scanner';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noopLoader = () => {};

export function ConfigLoader (loader: CallableFunction):ClassDecorator {
  return function(target: NewableFunction) {
    ConfigLoader.defineMetadata(target, loader);
  }
}

ConfigLoader.defineMetadata = (target: object, loader: CallableFunction)=> {
  Metadata.defineMetadata(ConfigLoader, loader, target);
}

ConfigLoader.getMetadata = (target: object):CallableFunction => {
  return Metadata.getMetadata(ConfigLoader, target) as CallableFunction || noopLoader;
}
