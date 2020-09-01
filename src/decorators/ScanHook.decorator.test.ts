import { ScanHook } from './ScanHook.decorator';
import { HookMetadata } from '@augejs/provider-scanner';
describe('decorators: ScanHook.decorator', () => {
  it('ScanHook.decorator should have correct metadata', () => {

    const hook: Function = ()=>{};
    @ScanHook(hook)
    class A {};
    expect(HookMetadata.getMetadata(A)[0]).toStrictEqual(hook);
  })
});
