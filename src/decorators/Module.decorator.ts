import { Metadata } from '@augejs/provider-scanner';
import { Parent } from './Parent.decorator';
import { Name } from './Name.decorator';
import { Injectable } from '../ioc';

export interface IModuleOptions {
  name?:string,
  providers?:any[],
  subModules?: any[],
}

export function Module(options?:IModuleOptions):ClassDecorator {
  return function(target: Function) {
    Metadata.decorate([
      Name(options?.name),
      Parent([
        ...Array.isArray(options?.providers) ? options!.providers : [],
        ...Array.isArray(options?.subModules) ? options!.subModules : [],
      ]),
      Injectable(),
    ] ,target);
  }
}
