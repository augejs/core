import objectPath from 'object-path';
import extend from 'extend';

// hack for if path is empty deep merge.
(objectPath as any)._set = objectPath.set;
(objectPath as any).set = (...args:any[]):any => {
  if (!args[1] && args[2]) {
    return extend(true, args[0], args[2]);
  }
  return (objectPath as any)._set(...args);
}

export {
  // https://www.npmjs.com/package/object-path
  objectPath,
  // https://www.npmjs.com/package/extend
  extend as objectExtend
};


