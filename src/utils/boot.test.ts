/* eslint-disable @typescript-eslint/no-explicit-any */
import { boot } from './boot';
import {
  ConfigLoader,
  LifecycleOnAppDidReadyHook,
  LifecycleOnAppWillReadyHook,
  LifecycleOnInitHook,
  Module,
  Provider,
  ScanHook,
} from '../decorators';
import { Inject } from '../ioc';
describe('utils: boot', () => {
  it('boot should have correct behavior', async () => {
    const results: string[] = [];
    const fn = (message: string) => {
      results.push(message);
    };

    @ConfigLoader(async () => {
      fn('ModuleAProvide1 Config');
    })
    @LifecycleOnInitHook(async (context: any, next: CallableFunction) => {
      fn('ModuleAProvide1 LifecycleOnInitHook 2 Start');
      await next();
      fn('ModuleAProvide1 LifecycleOnInitHook 2 End');
    })
    @LifecycleOnInitHook(async (context: any, next: CallableFunction) => {
      fn('ModuleAProvide1 LifecycleOnInitHook 1 Start');
      await next();
      fn('ModuleAProvide1 LifecycleOnInitHook 1 End');
    })
    @LifecycleOnAppWillReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleAProvide1 LifecycleOnAppWillReadyHook 2 Start');
        await next();
        fn('ModuleAProvide1 LifecycleOnAppWillReadyHook 2 End');
      },
    )
    @LifecycleOnAppWillReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleAProvide1 LifecycleOnAppWillReadyHook 1 Start');
        await next();
        fn('ModuleAProvide1 LifecycleOnAppWillReadyHook 1 End');
      },
    )
    @LifecycleOnAppDidReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleAProvide1 LifecycleOnAppDidReadyHook 2 Start');
        await next();
        fn('ModuleAProvide1 LifecycleOnAppDidReadyHook 2 End');
      },
    )
    @LifecycleOnAppDidReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleAProvide1 LifecycleOnAppDidReadyHook 1 Start');
        await next();
        fn('ModuleAProvide1 LifecycleOnAppDidReadyHook 1 End');
      },
    )
    @ScanHook(async (context: any, next: CallableFunction) => {
      fn('ModuleAProvide1 ScanHook 2 Start');
      await next();
      fn('ModuleAProvide1 ScanHook 2 End');
    })
    @ScanHook(async (context: any, next: CallableFunction) => {
      fn('ModuleAProvide1 ScanHook 1 Start');
      await next();
      fn('ModuleAProvide1 ScanHook 1 End');
    })
    @Provider()
    class ModuleAProvide1 {
      async onInit() {
        fn('ModuleAProvide1 onInit');
      }

      async onAppWillReady() {
        fn('ModuleAProvide1 onAppWillReady');
      }

      async onAppDidReady() {
        fn('ModuleAProvide1 onAppDidReady');
      }
    }
    @ConfigLoader(async () => {
      fn('ModuleA Config');
    })
    @LifecycleOnInitHook(async (context: any, next: CallableFunction) => {
      fn('ModuleA LifecycleOnInitHook 2 Start');
      await next();
      fn('ModuleA LifecycleOnInitHook 2 End');
    })
    @LifecycleOnInitHook(async (context: any, next: CallableFunction) => {
      fn('ModuleA LifecycleOnInitHook 1 Start');
      await next();
      fn('ModuleA LifecycleOnInitHook 1 End');
    })
    @LifecycleOnAppWillReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleA LifecycleOnAppWillReadyHook 2 Start');
        await next();
        fn('ModuleA LifecycleOnAppWillReadyHook 2 End');
      },
    )
    @LifecycleOnAppWillReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleA LifecycleOnAppWillReadyHook 1 Start');
        await next();
        fn('ModuleA LifecycleOnAppWillReadyHook 1 End');
      },
    )
    @LifecycleOnAppDidReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleA LifecycleOnAppDidReadyHook 2 Start');
        await next();
        fn('ModuleA LifecycleOnAppDidReadyHook 2 End');
      },
    )
    @LifecycleOnAppDidReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleA LifecycleOnAppDidReadyHook 1 Start');
        await next();
        fn('ModuleA LifecycleOnAppDidReadyHook 1 End');
      },
    )
    @ScanHook(async (context: any, next: CallableFunction) => {
      fn('ModuleA ScanHook 2 Start');
      await next();
      fn('ModuleA ScanHook 2 End');
    })
    @ScanHook(async (context: any, next: CallableFunction) => {
      fn('ModuleA ScanHook 1 Start');
      await next();
      fn('ModuleA ScanHook 1 End');
    })
    @Module({
      providers: [ModuleAProvide1],
    })
    class ModuleA {
      async onInit() {
        fn('ModuleA onInit');
      }

      async onAppWillReady() {
        fn('ModuleA onAppWillReady');
      }

      async onAppDidReady() {
        fn('ModuleA onAppDidReady');
      }
    }

    @ConfigLoader(async () => {
      fn('ModuleB Config');
    })
    @ScanHook(async (context: any, next: CallableFunction) => {
      fn('ModuleB ScanHook 2 Start');
      await next();
      fn('ModuleB ScanHook 2 End');
    })
    @ScanHook(async (context: any, next: CallableFunction) => {
      fn('ModuleB ScanHook 1 Start');
      await next();
      fn('ModuleB ScanHook 1 End');
    })
    @LifecycleOnInitHook(async (context: any, next: CallableFunction) => {
      fn('ModuleB LifecycleOnInitHook 2 Start');
      await next();
      fn('ModuleB LifecycleOnInitHook 2 End');
    })
    @LifecycleOnInitHook(async (context: any, next: CallableFunction) => {
      fn('ModuleB LifecycleOnInitHook 1 Start');
      await next();
      fn('ModuleB LifecycleOnInitHook 1 End');
    })
    @LifecycleOnAppWillReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleB LifecycleOnAppWillReadyHook 2 Start');
        await next();
        fn('ModuleB LifecycleOnAppWillReadyHook 2 End');
      },
    )
    @LifecycleOnAppWillReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleB LifecycleOnAppWillReadyHook 1 Start');
        await next();
        fn('ModuleB LifecycleOnAppWillReadyHook 1 End');
      },
    )
    @LifecycleOnAppDidReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleB LifecycleOnAppDidReadyHook 2 Start');
        await next();
        fn('ModuleB LifecycleOnAppDidReadyHook 2 End');
      },
    )
    @LifecycleOnAppDidReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('ModuleB LifecycleOnAppDidReadyHook 1 Start');
        await next();
        fn('ModuleB LifecycleOnAppDidReadyHook 1 End');
      },
    )
    @Module({
      subModules: [ModuleA],
    })
    class ModuleB {
      async onInit() {
        fn('ModuleB onInit');
      }

      async onAppWillReady() {
        fn('ModuleB onAppWillReady');
      }

      async onAppDidReady() {
        fn('ModuleB onAppDidReady');
      }
    }

    // -

    @ConfigLoader(async () => {
      fn('AppModule Config');
    })
    @ScanHook(async (context: any, next: CallableFunction) => {
      fn('AppModule ScanHook 2 Start');
      await next();
      fn('AppModule ScanHook 2 End');
    })
    @ScanHook(async (context: any, next: CallableFunction) => {
      fn('AppModule ScanHook 1 Start');
      await next();
      fn('AppModule ScanHook 1 End');
    })
    @LifecycleOnInitHook(async (context: any, next: CallableFunction) => {
      fn('AppModule LifecycleOnInitHook 2 Start');
      await next();
      fn('AppModule LifecycleOnInitHook 2 End');
    })
    @LifecycleOnInitHook(async (context: any, next: CallableFunction) => {
      fn('AppModule LifecycleOnInitHook 1 Start');
      await next();
      fn('AppModule LifecycleOnInitHook 1 End');
    })
    @LifecycleOnAppWillReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('AppModule LifecycleOnAppWillReadyHook 2 Start');
        await next();
        fn('AppModule LifecycleOnAppWillReadyHook 2 End');
      },
    )
    @LifecycleOnAppWillReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('AppModule LifecycleOnAppWillReadyHook 1 Start');
        await next();
        fn('AppModule LifecycleOnAppWillReadyHook 1 End');
      },
    )
    @LifecycleOnAppDidReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('AppModule LifecycleOnAppDidReadyHook 2 Start');
        await next();
        fn('AppModule LifecycleOnAppDidReadyHook 2 End');
      },
    )
    @LifecycleOnAppDidReadyHook(
      async (context: any, next: CallableFunction) => {
        fn('AppModule LifecycleOnAppDidReadyHook 1 Start');
        await next();
        fn('AppModule LifecycleOnAppDidReadyHook 1 End');
      },
    )
    @Module({
      subModules: [ModuleB],
    })
    class AppModule {
      async onInit() {
        fn('AppModule onInit');
      }

      async onAppWillReady() {
        fn('AppModule onAppWillReady');
      }

      async onAppDidReady() {
        fn('AppModule onAppDidReady');
      }
    }

    (process as any)._nextTick = process.nextTick;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    process.nextTick = () => {};
    const ctx = await boot(AppModule);
    process.nextTick = (process as any)._nextTick;
    await (ctx.lifeCyclePhasesHooks as any)?.readyLifecyclePhase();

    const expectResults = [
      'ModuleAProvide1 Config',
      'ModuleA Config',
      'ModuleB Config',
      'AppModule Config',

      'AppModule ScanHook 1 Start',
      'AppModule ScanHook 2 Start',

      'ModuleB ScanHook 1 Start',
      'ModuleB ScanHook 2 Start',

      'ModuleA ScanHook 1 Start',
      'ModuleA ScanHook 2 Start',

      'ModuleAProvide1 ScanHook 1 Start',
      'ModuleAProvide1 ScanHook 2 Start',

      'ModuleAProvide1 ScanHook 2 End',
      'ModuleAProvide1 ScanHook 1 End',

      'ModuleA ScanHook 2 End',
      'ModuleA ScanHook 1 End',

      'ModuleB ScanHook 2 End',
      'ModuleB ScanHook 1 End',

      'AppModule ScanHook 2 End',
      'AppModule ScanHook 1 End',

      'ModuleAProvide1 LifecycleOnInitHook 1 Start',
      'ModuleAProvide1 LifecycleOnInitHook 2 Start',
      'ModuleAProvide1 onInit',
      'ModuleAProvide1 LifecycleOnInitHook 2 End',
      'ModuleAProvide1 LifecycleOnInitHook 1 End',

      'ModuleA LifecycleOnInitHook 1 Start',
      'ModuleA LifecycleOnInitHook 2 Start',
      'ModuleA onInit',
      'ModuleA LifecycleOnInitHook 2 End',
      'ModuleA LifecycleOnInitHook 1 End',

      'ModuleB LifecycleOnInitHook 1 Start',
      'ModuleB LifecycleOnInitHook 2 Start',
      'ModuleB onInit',
      'ModuleB LifecycleOnInitHook 2 End',
      'ModuleB LifecycleOnInitHook 1 End',

      'AppModule LifecycleOnInitHook 1 Start',
      'AppModule LifecycleOnInitHook 2 Start',
      'AppModule onInit',
      'AppModule LifecycleOnInitHook 2 End',
      'AppModule LifecycleOnInitHook 1 End',

      // // -

      'ModuleAProvide1 LifecycleOnAppWillReadyHook 1 Start',
      'ModuleAProvide1 LifecycleOnAppWillReadyHook 2 Start',
      'ModuleAProvide1 onAppWillReady',
      'ModuleAProvide1 LifecycleOnAppWillReadyHook 2 End',
      'ModuleAProvide1 LifecycleOnAppWillReadyHook 1 End',

      'ModuleA LifecycleOnAppWillReadyHook 1 Start',
      'ModuleA LifecycleOnAppWillReadyHook 2 Start',
      'ModuleA onAppWillReady',
      'ModuleA LifecycleOnAppWillReadyHook 2 End',
      'ModuleA LifecycleOnAppWillReadyHook 1 End',

      'ModuleB LifecycleOnAppWillReadyHook 1 Start',
      'ModuleB LifecycleOnAppWillReadyHook 2 Start',
      'ModuleB onAppWillReady',
      'ModuleB LifecycleOnAppWillReadyHook 2 End',
      'ModuleB LifecycleOnAppWillReadyHook 1 End',

      'AppModule LifecycleOnAppWillReadyHook 1 Start',
      'AppModule LifecycleOnAppWillReadyHook 2 Start',
      'AppModule onAppWillReady',
      'AppModule LifecycleOnAppWillReadyHook 2 End',
      'AppModule LifecycleOnAppWillReadyHook 1 End',

      // // -

      'ModuleAProvide1 LifecycleOnAppDidReadyHook 1 Start',
      'ModuleAProvide1 LifecycleOnAppDidReadyHook 2 Start',
      'ModuleAProvide1 onAppDidReady',
      'ModuleAProvide1 LifecycleOnAppDidReadyHook 2 End',
      'ModuleAProvide1 LifecycleOnAppDidReadyHook 1 End',

      'ModuleA LifecycleOnAppDidReadyHook 1 Start',
      'ModuleA LifecycleOnAppDidReadyHook 2 Start',
      'ModuleA onAppDidReady',
      'ModuleA LifecycleOnAppDidReadyHook 2 End',
      'ModuleA LifecycleOnAppDidReadyHook 1 End',

      'ModuleB LifecycleOnAppDidReadyHook 1 Start',
      'ModuleB LifecycleOnAppDidReadyHook 2 Start',
      'ModuleB onAppDidReady',
      'ModuleB LifecycleOnAppDidReadyHook 2 End',
      'ModuleB LifecycleOnAppDidReadyHook 1 End',

      'AppModule LifecycleOnAppDidReadyHook 1 Start',
      'AppModule LifecycleOnAppDidReadyHook 2 Start',
      'AppModule onAppDidReady',
      'AppModule LifecycleOnAppDidReadyHook 2 End',
      'AppModule LifecycleOnAppDidReadyHook 1 End',
    ];

    expect(results).toEqual(expectResults);
  });
});
