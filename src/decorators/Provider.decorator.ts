import { Metadata } from '@augejs/provider-scanner';
import { Injectable } from '../ioc';
import { Name } from './Name.decorator';

type ProviderOptions = {
  name?:string
}

export function Provider(opts?: ProviderOptions):ClassDecorator {
  return function(target: NewableFunction) {
    Metadata.decorate([
      Name(opts?.name),
      Injectable(),
    ] ,target);
  }
}
