import { ScanHook } from './ScanHook.decorator';

describe('decorators: ScanHook.decorator', () => {
  it('ScanHook.decorator should have correct metadata', () => {

    const hook = async (_: any, next: Function)=>{};
    @ScanHook(hook)
    class A {};
    expect(ScanHook.getMetadata(A)[0]).toStrictEqual(hook);
  })
});
