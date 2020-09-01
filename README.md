[![npm version](https://badge.fury.io/js/%40augejs%2Fmodule-core.svg)](https://badge.fury.io/js/%40augejs%2Fmodule-core)

`@augejs/module-core` is a module framework which support using `dependency injection` way to composite kinds of `Modules` and `Providers` to complex application.

![provider tree](./docs/assets/application-structure.png)

### Document

https://augejs.github.io/docs/

### Module

A Module is a container which can fill with kinds of providers. 

### Provider

A Provider is a abstract concept. Maybe an Entity, a File, a structure, a component, a service, or a string.

### How To Use
```javascript

import { boot, Application } from '@augejs/module-core';

@Application()
export class AppModule {
  onInit() {
    console.log('AppModule onInit ');
  }
  onAppDidReady(context:any) {
    console.log('AppModule onAppDidReady ');
  }
}

(async () => {
 await boot(AppModule);
})();

```







