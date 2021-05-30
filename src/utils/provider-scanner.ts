import { Container } from '../ioc';
import {
  ScanContext as IProviderScanContext,
  ScanNode as IProviderScanNode,
} from '@augejs/provider-scanner';

export interface ScanContext extends IProviderScanContext {
  rootScanNode?: ScanNode;
  container: Container;
  // eslint-disable-next-line @typescript-eslint/ban-types
  getScanNodeByProvider(provider: object): ScanNode;
}

export interface ScanNode extends IProviderScanNode {
  context: ScanContext;
  children: ScanNode[];
  parent: ScanNode | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  instance: object | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getConfig(path?: string): any;
}
