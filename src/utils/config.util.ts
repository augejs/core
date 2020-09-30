import nodePath from 'path';

export function getConfigAccessPath(scanNodeNamePaths: string[], path?:string):string {
  // we should ignore the the first name path
  const configPaths:string[] = scanNodeNamePaths.slice(1);
  let configAccessPath:string = '';
  if (!path || path === '' || path === '.') {
    configAccessPath = configPaths.join('.');
  } else {
    const configUrlPath:string = configPaths.join('/');
    if (nodePath.isAbsolute(path)) {
      configAccessPath = path;
    } else {
      configAccessPath = nodePath.join(configUrlPath, path);
      if (configAccessPath.startsWith('.')) {
        return '';
      }
    }
  }

  return configAccessPath.split('/').filter(Boolean).join('.');
}
