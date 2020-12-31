typeof (process as any)?.pkg !== 'undefined' && (process.env.NODE_ENV = process.env.NODE_ENV || 'production');

import path from 'path';

export * from './decorators';
export * from './ioc';
export * from './logger';
export * from './utils';

export const __appRootDir: string = process.env.APP_ROOT_DIR ||
  (process.env.NODE_ENV === 'production' ? path.join(require.main!.filename, '..') : process.cwd());

export {
  hookUtil,
  Metadata,
  HookFunction,
  ComposeHooksFunction,
} from '@augejs/provider-scanner';

