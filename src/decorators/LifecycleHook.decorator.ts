import { Metadata, HookMetadata, HookFunction } from '@augejs/provider-scanner';
import { ScanHook } from './ScanHook.decorator';
import { ScanNode } from '../utils';

export function LifecycleHook(
  lifecycleName: string,
  hooks: HookFunction | HookFunction[],
): ClassDecorator {
  return function (target: NewableFunction) {
    Metadata.decorate(
      [
        ScanHook(async (scanNode: ScanNode, next: CallableFunction) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          HookMetadata.defineMetadata(
            (scanNode.lifeCycleNodes as any)[lifecycleName],
            hooks,
          );
          await next();
        }),
      ],
      target,
    );
  };
}

export function LifecycleOnInitHook(
  hooks: HookFunction | HookFunction[],
): ClassDecorator {
  return LifecycleHook('onInit', hooks);
}

export function LifecycleOnAppWillReadyHook(
  hooks: HookFunction | HookFunction[],
): ClassDecorator {
  return LifecycleHook('onAppWillReady', hooks);
}

export function LifecycleOnAppDidReadyHook(
  hooks: HookFunction | HookFunction[],
): ClassDecorator {
  return LifecycleHook('onAppDidReady', hooks);
}

export function Lifecycle__onAppReady__Hook(
  hooks: HookFunction | HookFunction[],
): ClassDecorator {
  return LifecycleHook('__onAppReady__', hooks);
}

export function LifecycleOnAppWillCloseHook(
  hooks: HookFunction | HookFunction[],
): ClassDecorator {
  return LifecycleHook('onAppWillClose', hooks);
}

export interface LifecycleComponent {
  onInit?() :void | Promise<void>
  onAppWillReady?() :void | Promise<void>
  onAppDidReady?() :void | Promise<void>
  __onAppReady__?(): void | Promise<void>
  onAppWillClose?() :void | Promise<void>
}
