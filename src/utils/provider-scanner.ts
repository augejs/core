import { Container } from '../ioc';
import { IScanContext as IProviderScanContext, IScanNode as IProviderScanNode } from '@augejs/provider-scanner';

export interface IScanContext extends IProviderScanContext {
  rootScanNode?: IScanNode
  container: Container
  processArgv: { [key: string]: any }
  globalConfig: { [key: string]: any }
  getScanNodeByProvider(provider: object): IScanNode
}

export interface IScanNode extends IProviderScanNode {
  context: IScanContext
  children: IScanNode[]
  parent: IScanNode | null
  instance: object | null
  getConfig(path?: string): any
}
