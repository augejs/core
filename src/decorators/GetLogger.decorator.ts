import { NameMetadata } from '@augejs/provider-scanner';
import { ILogger, Logger } from "../logger";
import { IScanNode } from '../utils';

const noopObject = {};
export function GetLogger(context:string = ''):PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    let memoizedName = `$memoized_${propertyKey.toString()}`;
    (target as any)[memoizedName] = noopObject;

    const descriptor:PropertyDescriptor = {
      get():ILogger {
        const instance:any = this;
        if (instance[memoizedName] === noopObject) {
          const scanNode:IScanNode = instance.$scanNode;
          const logger:ILogger = Logger.getLogger(context || NameMetadata.getMetadata(scanNode.provider));
          instance[memoizedName] = logger;
        }
        return instance[memoizedName] as ILogger;
      },
    };

    Object.defineProperty(target, propertyKey, descriptor);
    return descriptor;
  }
}
