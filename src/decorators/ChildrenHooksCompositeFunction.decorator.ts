import { ChildrenHooksCompositeFunctionMetadata } from '@augejs/provider-scanner';

export function ChildrenHooksCompositeFunction(fn: Function): ClassDecorator {
  return function(target: Function) {
    ChildrenHooksCompositeFunction.defineMetadata(target, fn);
  }
}

ChildrenHooksCompositeFunction.defineMetadata = (target: object, fn: Function) => {
  ChildrenHooksCompositeFunctionMetadata.defineMetadata(target, fn);
}

ChildrenHooksCompositeFunction.getMetadata = (target: object): Function => {
  return ChildrenHooksCompositeFunctionMetadata.getMetadata(target);
}

