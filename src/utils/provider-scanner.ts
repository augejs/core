import { Container } from '../ioc';
import { IScanContext as IProviderScanContext, IScanNode as IProviderScanNode } from '@augejs/provider-scanner';

export interface IScanContext extends IProviderScanContext {
  rootScanNode?: IScanNode
  container: Container
  // eslint-disable-next-line @typescript-eslint/ban-types
  getScanNodeByProvider(provider: object): IScanNode
}

export interface IScanNode extends IProviderScanNode {
  context: IScanContext
  children: IScanNode[]
  parent: IScanNode | null
  // eslint-disable-next-line @typescript-eslint/ban-types
  instance: object | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getConfig(path?: string): any
}
