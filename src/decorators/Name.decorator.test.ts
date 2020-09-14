import { Name } from './Name.decorator';
describe('decorators: Name.decorator.test', () => {
  it('Name.decorator should have correct metadata', () => {

    @Name()
    class A {}
    expect(Name.getMetadata(A)).toBe('a');

    @Name('test')
    class B {}
    expect(Name.getMetadata(B)).toBe('test');
  })
});
