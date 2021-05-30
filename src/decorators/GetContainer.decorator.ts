import { Container } from '../ioc';
import { ScanNode } from '../utils';

export function GetContainer(): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: object, propertyKey: string | symbol) => {
    const descriptor: PropertyDescriptor = {
      get(): Container {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return ((this as any).$scanNode as ScanNode).context.container;
      },
    };

    Object.defineProperty(target, propertyKey, descriptor);
    return descriptor;
  };
}
