/* eslint-disable @typescript-eslint/no-explicit-any */

import { Metadata } from '@augejs/provider-scanner';
import { Parent } from './Parent.decorator';
import { Name } from './Name.decorator';
import { Injectable } from '../ioc';

interface ModuleOptions {
  name?: string;
  providers?: (NewableFunction | Record<string, unknown>)[];
  subModules?: (NewableFunction | NewableFunction[])[];
}

export function Module(opts?: ModuleOptions): ClassDecorator {
  return function (target: NewableFunction) {
    Metadata.decorate(
      [
        Name(opts?.name),
        Parent([
          ...(Array.isArray(opts?.providers) ? opts!.providers : []),
          ...(Array.isArray(opts?.subModules) ? opts!.subModules : []),
        ]),
        Injectable(),
      ],
      target,
    );
  };
}
