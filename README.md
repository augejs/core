[![npm version](https://badge.fury.io/js/%40augejs%2Fmodule-core.svg)](https://badge.fury.io/js/%40augejs%2Fmodule-core)

`@augejs/module-core` is a module framework which support using `dependency injection` way to composite kinds of `Modules` and `Providers` to complex application.

![provider tree](./docs/assets/application-structure.png)

### Document

https://augejs.github.io/docs/

### Module

A Module is a container which can fill with kinds of providers. 

### Provider

A Provider is a abstract concept. Maybe an Entity, a File, a structure, a component, a service, or a string.

### Usage
```bash
npm install @augejs/module-core reflect-metadata -S
```

```javascript

import { Module, Config, Value, boot, ILogger, GetLogger } from '@augejs/module-core';

@Module()
@Config({
  fullName: "augejs awesome~",
  hello: {
    name: 'augejs',
    age: 12,
  }
})
class Module1 {
  @Value('hello')
  testName!:string;

  @Value('fullName')
  fullName!:string;

  @Value('hello.age')
  age!:number;

  @GetLogger()
  logger!:ILogger;

  async onInit() {
    this.logger.info('Module1 onInit');
    this.logger.info(`config: hello: ${JSON.stringify(this.testName)}`);
    this.logger.info(`config fullName: ${this.fullName}`);
    this.logger.info(`config age: ${this.age}`);
  }
}

@Module()
class Module2 {
  @GetLogger()
  logger!:ILogger;

  async onInit() {
    this.logger.info('Module2 onInit');
  }
}

@Module({
  subModules: [
    Module1, [Module2]
  ]
})
class AppModule {

  @GetLogger()
  logger!:ILogger;

  async onInit() {
    this.logger.info('AppModule onInit');
  }
}

(async () => {
  await boot(AppModule);
})();


```







