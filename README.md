# augejs

[![npm version](https://badge.fury.io/js/%40augejs%2Fcore.svg)](https://www.npmjs.com/package/@augejs/core) [![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

[`augejs`](https://github.com/augejs/augejs.github.io) is a progressive Node.js framework for building applications.

:star2: Star us on GitHub — it helps! :clap:

https://github.com/augejs/augejs.github.io

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Document](#document)
- [Examples](#Examples)
- [Related Efforts](#related-efforts)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Description

`augejs` is a progressive Node.js framework for building applications. It uses modern JavaScript built with [TypeScript](http://www.typescriptlang.org/).

Look at a diagram below:

<img src="./docs/assets/application-structure.png" alt="Application Module Tree" title="Application Module Tree" width="80%"/>

An application is composite of  3 types of core fundamentals:

`Provider` is an abstract logic unit which can provide for `Module`.

`Module` is consists of  `Provider` and `Module`.

`Decorator` is an abstract logic unit  which can decorate for `Module` and `Provider`.

## Features

+ :penguin: Support TypeScript (version 4.0 or higher).

+ :penguin: Minimum core to start with，support plugin by using Extend and Adapter.

+ :baby_chick: Excellent performance with high unit test coverage rate.

+ :baby_chick: Progressive Development.

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
npm install @augejs/core
```

## Usage

```javascript
import { Module, boot } from '@augejs/core';

// we use a @Module decorator to define a module
@Module()
class AppModule {
  async onInit() {
    // the onInit lifecycle method will be called when application boot
    console.log('hello augejs');
  }
}

(async () => {
  // boot the whole application by module.
  await boot(AppModule);
})();
```

## Document

visit [augejs.github.io](https://github.com/augejs/augejs.github.io). :tada:

## Examples

see the [Examples](https://github.com/augejs/examples). :open_book:

## Related Efforts

- [Art of Readme](https://github.com/noffle/art-of-readme) - 💌 Learn the art of writing quality READMEs.
- [open-source-template](https://github.com/davidbgk/open-source-template/) - A README template to encourage open-source contributions.

## Maintainers

[Alex Zhang](https://github.com/alex-zhang).

## Contributing

Feel free to dive in! [Open an issue](https://github.com/augejs/core/issues) or submit PRs.

`augejs` follows the [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.

## License

[MIT](LICENSE) © augejs
