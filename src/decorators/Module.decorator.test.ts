import { Module } from './Module.decorator';
import { Name } from './Name.decorator';
import { Parent } from './Parent.decorator';

describe('decorators: Module', () => {
  it('should module have correct name', () => {
    @Module()
    class ModuleA {}
    expect(Name.getMetadata(ModuleA)).toBe('moduleA');

    @Module({
      name: 'test'
    })
    class ModuleB {}
    expect(Name.getMetadata(ModuleB)).toBe('test');
  })

  it('should module have correct submodules', () => {
    @Module()
    class ModuleA {}

    @Module()
    class ModuleB {}

    @Module()
    class ModuleC {}

    @Module({
      subModules: [
        ModuleA,
        ModuleB,
        [ModuleC]
      ]
    })
    class ModuleZ {}
    expect(Parent.getMetadata(ModuleZ)).toEqual([
      ModuleA,
      ModuleB
    ]);

    expect(Parent.getMetadata(ModuleB)).toEqual([
      ModuleC
    ]);
  })
})
