erb-sqlite-example
==================

[![Build Status](https://travis-ci.org/amilajack/erb-sqlite-example.svg?branch=master&maxAge=2592)](https://travis-ci.org/amilajack/erb-sqlite-example)

**An example of erb with native dependencies (sqlite3 in this case)**

## Setup
⚠️ These instructions assume that you have yarn. If you don't, make sure to install it: `npm i -g yarn`

```bash
git clone https://github.com/amilajack/erb-sqlite-example.git
cd erb-sqlite-example && yarn
cd app && yarn
cd ..
yarn dev
```

## Notes
**The changes that were made were installing sqlite to `./app/package.json`:**
```bash
cd app
yarn add sqlite -S
```

erb (electron-react-boilerplate) automatically includes sqlite3 using webpack. It is imported as an external, meaning that webpack doesn't touch it. Some native dependencies have issues with webpack. To avoid this, add those kinds of dependencies to your `./app/package.json`. These dependencies are automatically rebuilt against electron's node version after installing (see the postinstall script in `./app/package.json`).
