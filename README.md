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

Basic example with some files:

```
yarn run validate-po /home/localizations/en.po /home/localizations/ru.po
```

Example with entire directory:

```
yarn run validate-po /home/localizations
```
