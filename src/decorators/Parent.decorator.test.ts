import { Parent } from './Parent.decorator';

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
    expect(Parent.getMetadata(A)).toEqual([
      {
        a: 1
      },
      {
        b: 1
      }
    ]);
  })
});
