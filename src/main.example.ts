import { Application, Module, Config, Value , boot } from './main';

@Module()
@Config({
  fullName: "1231313",
  hello: {
    name: 1,
    age: 'asdadad',
    adadad: 'adadadad'
  }
})
class Module1 {

  @Value('./hello')
  testName!:string;

  async onInit() {
    console.log('Module1 onInit');

    console.log('--->', this.testName);
  }
}

@Module()
class Module2 {
  async onInit() {
    console.log('Module2 onInit');
  }
}

@Application({
  subModules: [
    Module1, [Module2]
  ]
})
class AppModule {
  async onInit() {
    console.log('AppModule onInit');
  }
}

(async () => {
  await boot(AppModule);
})();


