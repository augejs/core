import { Name } from './Name.decorator';
import { NameMetadata } from '@augejs/provider-scanner';
describe('decorators: Name.decorator.test', () => {
  it('Name.decorator should have correct metadata', () => {

    @Name()
    class A {}
    expect(NameMetadata.getMetadata(A)).toBe('a');

    @Name('test')
    class B {}
    expect(NameMetadata.getMetadata(B)).toBe('test');
  })
});
