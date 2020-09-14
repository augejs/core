import { IScanNode } from '../utils';

const noopObject = {};

/**
 * @param {string} [path='']
 * @returns {PropertyDecorator}
 */
export function Value(path?:string):PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    let memoizedName = `$memoized_${propertyKey.toString()}`;
    (target as any)[memoizedName] = noopObject;
    const descriptor:PropertyDescriptor = {
      get():any {
        const instance:any = this as any;
        if (instance[memoizedName] === noopObject) {
          // expensive calculate
          const scanNode:IScanNode = instance.$scanNode;
          const result:any = scanNode.getConfig(path)
          instance[memoizedName] = result;
        }
        return instance[memoizedName];
      },
    };

    Object.defineProperty(target, propertyKey, descriptor);
    return descriptor;
  };
}
