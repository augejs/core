/* eslint-disable @typescript-eslint/no-explicit-any */
import { IScanNode } from '../utils';

const noopObject = {};

/**
 * @param {string} [path='']
 * @returns {PropertyDecorator}
 */
export function Value(path?:string, transformer?: (value: any, path?: string, scanNode?: IScanNode)=>any):PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol) => {
    const memoizedName = `$memoized_${propertyKey.toString()}`;
    (target as any)[memoizedName] = noopObject;
    const descriptor:PropertyDescriptor = {
      get():any {
        const instance:any = this as any;
        if (instance?.[memoizedName] === noopObject) {
          // expensive calculate
          const scanNode:IScanNode = instance.$scanNode;
          let result:any = scanNode.getConfig(path)
          if (transformer) {
            result = transformer(result, path, scanNode);
          }
          instance[memoizedName] = result;
        }
        return instance[memoizedName];
      },
    };

    Object.defineProperty(target, propertyKey, descriptor);
    return descriptor;
  };
}
