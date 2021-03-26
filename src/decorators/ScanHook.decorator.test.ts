import { ScanHook } from './ScanHook.decorator';

describe('decorators: ScanHook.decorator', () => {
  it('ScanHook.decorator should have correct metadata', () => {

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const hook = async ()=>{};
    @ScanHook(hook)
    class A {}

    expect(ScanHook.getMetadata(A)[0]).toStrictEqual(hook);
  })
});
