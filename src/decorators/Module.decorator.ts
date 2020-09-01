import { IScanNode, Metadata, HookMetadata, hookUtil } from '@augejs/provider-scanner';

import { Parent } from './Parent.decorator';
import { Name } from './Name.decorator';
import { ScanHook } from './ScanHook.decorator';
import { Injectable } from '../ioc';
import { ScanInputKeys, ScanOutputKeys } from '../constants';
import { Container } from '../ioc';
import { objectPath, getConfigAccessPath } from '../utils';
import { Config } from './Config.decorator';
import { ConfigLoader } from './ConfigLoader.decorator';

export interface IModuleOptions {
  name?:string,
  providers?:any[],
  subModules?: any[],
  hooks?: Function | Function[],
}

export function Module(options?:IModuleOptions):ClassDecorator {
  return function(target: Function) {
    const optionsHooks: Function [] = hookUtil.ensureHooks(options?.hooks || null)
    const hooks: Function [] = [
      runtimeConfigHook,
      dependencyInjectionHook,
      ...optionsHooks,
    ];

    const optionsProvides: any[] = Array.isArray(options?.providers) ? options!.providers : [];
    const optionsSubModules: Function[] = Array.isArray(options?.subModules) ? options!.subModules : [];

    const children: object[] = [
      ...optionsProvides,
      ...optionsSubModules,
    ];

    optionsProvides.forEach((provider: object) => {
      HookMetadata.defineMetadata(provider, [
        runtimeConfigHook,
        dependencyInjectionHook,
      ]);
    })

    Metadata.decorate([
      Injectable(),
      Name(options?.name),
      ScanHook(hooks),
      Parent(children),
    ] ,target);
  }
}

async function runtimeConfigHook(scanNode: IScanNode, next: Function) {
  const configAccessPath:string = getConfigAccessPath(scanNode.namePaths);
  const runtimeConfig:object = scanNode.context!.outputs.get(ScanOutputKeys.RuntimeConfig);
  // provide config.
  // https://www.npmjs.com/package/object-path
  let providerConfig:object = Config.getMetadata(scanNode.provider);
  const providerConfigLoader:Function = ConfigLoader.getMetadata(scanNode.provider);
  const providerConfigLoaderConfigResult:any = await providerConfigLoader(providerConfig, scanNode);
  if (providerConfigLoaderConfigResult !== undefined) {
    providerConfig = providerConfigLoaderConfigResult;
  }

  // https://www.npmjs.com/package/extend
  objectPath.set<object>(runtimeConfig, configAccessPath, providerConfig);

  await next();
}

async function dependencyInjectionHook(scanNode: IScanNode, next: Function) {
  const container:Container = scanNode.context!.inputs.get(ScanInputKeys.Container);
  let instanceFactory:Function | null = null;

  const provider:any = scanNode.provider;
  // here we need deal with kinds of provider value.
  if (typeof provider === 'function') {
    container.bind(provider).toSelf();
    instanceFactory = () => {
      return container.get(provider);
    }
  } else if (typeof provider === 'object') {
    if (Object.prototype.hasOwnProperty.call(provider, 'id') && !!provider.id) {
      const identifier:any = provider.id;
      if (Object.prototype.hasOwnProperty.call(provider, 'useValue')) {
        container.bind(identifier).toConstantValue(provider.useValue);
        instanceFactory = () => {
          return container.get(identifier);
        }
      } else if (Object.prototype.hasOwnProperty.call(provider, 'useClass')) {
        container.bind(identifier).to(provider.useClass);
        instanceFactory = () => {
          return container.get(identifier);
        }
      } else if (Object.prototype.hasOwnProperty.call(provider, 'useFactory')) {
        container.bind(identifier).toDynamicValue(()=>{
          const scanNodeConfig:any = scanNode.outputs.get(ScanOutputKeys.InstanceConfig);
          return provider.useFactory(scanNodeConfig, scanNode);
        });
        instanceFactory = () => {
          return container.get(identifier);
        }
      }
    }
  }

  if (instanceFactory !== null) {
    scanNode.outputs.set(ScanOutputKeys.InstanceFactory, instanceFactory);
  }

  await next();
}
