import { Parent } from './Parent.decorator';
import { ParentMetadata } from '@augejs/provider-scanner';
describe('decorators: Parent.decorator.test', () => {
  it('Parent.decorator should have correct metadata', () => {

    @Parent([
      {
        a: 1
      },
      {
        b: 1
      }
    ])
    class A {}
    expect(ParentMetadata.getMetadata(A)).toEqual([
      {
        a: 1
      },
      {
        b: 1
      }
    ]);
  })
});
