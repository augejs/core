import { IScanNode, NameMetadata } from "@augejs/provider-scanner";
import { ILogger, Logger } from "../logger";

const noopObject = {};
export function GetLogger(context:string = ''):PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    let memoizedName = `$memoized_${propertyKey.toString()}`;
    (target as any)[memoizedName] = noopObject;

    const descriptor:PropertyDescriptor = {
      get():ILogger {
        if ((this as any)[memoizedName] === noopObject) {
          const scanNode:IScanNode = (this as any).$scanNode;
          const logger:ILogger = Logger.getLogger(context || NameMetadata.getMetadata(scanNode.provider));
          (this as any)[memoizedName] = logger;
        }
        return (this as any)[memoizedName] as ILogger;
      },
    };

    Object.defineProperty(target, propertyKey, descriptor);
    return descriptor;
  }
}
