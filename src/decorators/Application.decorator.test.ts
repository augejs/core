import { Application } from './Application.decorator';

describe('decorators: App.decorator', () => {
  it('App.decorator is actually a Module.decorator', async () => {

    @Application()
    class AppModule {}

    expect(1).toBe(1);
  })
});
