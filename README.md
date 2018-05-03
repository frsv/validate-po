# validate-po

[![Build Status](https://travis-ci.org/frsv/validate-po.svg?branch=master)](https://travis-ci.org/frsv/validate-po)
[![Coverage Status](https://coveralls.io/repos/github/frsv/validate-po/badge.svg?branch=master)](https://coveralls.io/github/frsv/validate-po?branch=master)

Validate .po files for string translations, correct interpolations and other errors

## Installation

```
yarn add --dev validate-po
```
or
```
npm install --save-dev validate-po
```

Add script to your `package.json`: 

```diff
  "scripts": {
+   "validate-po": "validate-po",
+   "test": "jest && eslint . && yarn run validate-po ./localizations"
  }
```

## Usage

For all available options run:

```bash
yarn run validate-po --help
```

You can pass paths to some files:

```bash
yarn run validate-po /home/localizations/en.po /home/localizations/ru.po
```

Or even entire directory:

```bash
yarn run validate-po /home/localizations
```

## Todo`s

* Custom validators
* Group output
* More examples

## Contributing

[Contribution guidelines for this project](CONTRIBUTING.md)

## License

[MIT](LICENSE)
