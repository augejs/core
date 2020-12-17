import { IScanNode } from '../utils';

export function GetScanNode():PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const descriptor:PropertyDescriptor = {
      get():IScanNode {
        return (this as any).$scanNode;
      },
    };

    Object.defineProperty(target, propertyKey, descriptor);
    return descriptor;
  }
}
