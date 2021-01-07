import { Container } from '../ioc';

export function GetContainer():PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const descriptor:PropertyDescriptor = {
      get():Container {
        return (this as any).$scanNode.context.container
      },
    };

    Object.defineProperty(target, propertyKey, descriptor);
    return descriptor;
  }
}
