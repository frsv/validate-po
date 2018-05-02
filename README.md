# validate-po

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
