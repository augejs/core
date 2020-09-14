import { Module, Config, Value, boot, ILogger, GetLogger } from './main';

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


