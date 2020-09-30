import { Metadata } from '@augejs/provider-scanner';
import { Parent } from './Parent.decorator';
import { Name } from './Name.decorator';
import { Injectable } from '../ioc';

type ModuleOptions = {
  name?:string,
  providers?:any[],
  subModules?: any[],
}

export function Module(opts?:ModuleOptions):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      Name(opts?.name),
      Parent([
        ...Array.isArray(opts?.providers) ? opts!.providers : [],
        ...Array.isArray(opts?.subModules) ? opts!.subModules : [],
      ]),
      Injectable(),
    ] ,target);
  }
}
