import { IScanNode } from "@augejs/provider-scanner";
import { ScanOutputKeys } from "../constants";
import { objectPath, getConfigAccessPath } from '../utils';

const noopObject = {};

/**
 * @param {string} [path='']
 * @returns {PropertyDecorator}
 */
export function Value(path:string = '.'):PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    let memoizedName = `$memoized_${propertyKey.toString()}`;
    (target as any)[memoizedName] = noopObject;

    const descriptor:PropertyDescriptor = {
      get():object {
        if ((this as any)[memoizedName] === noopObject) {
          // expensive calculate
          const scanNode:IScanNode = (this as any).$scanNode;
          const runtimeConfig:object = scanNode.context!.outputs.get(ScanOutputKeys.RuntimeConfig);
          const configAccessPath:string = getConfigAccessPath(scanNode.namePaths, path);
          let result:any = runtimeConfig;
          if (configAccessPath) {
            // https://www.npmjs.com/package/object-path
            if (!objectPath.has(runtimeConfig, configAccessPath)) {
              throw new Error(`can't find any config from the path ${path}`);
            } else {
              result = objectPath.get(runtimeConfig, configAccessPath);
            }
          }
          (this as any)[memoizedName] = result;
        }
        return (this as any)[memoizedName] as object;
      },
    };

    Object.defineProperty(target, propertyKey, descriptor);
    return descriptor;
  };
}
