# TUC SmartCityCloud Website Client

![TUC SmartCityCloud logo](src/assets/img/tuc_smartcitycloud_logo.png)

This project contains the TUC SmartCityCloud web site based on [vue.js](https://vuejs.org) and the [CoPilot theme](https://github.com/misterGF/CoPilot) (i.e. [Admin-LTE](https://adminlte.io))

## Documentation

Please see the TUC SmartCityCloud [documentation repository](https://gitlab.hrz.tu-chemnitz.de/tuc-drivecloud/tucdrivecloud-documentation) and especially the [wiki](https://gitlab.hrz.tu-chemnitz.de/tuc-drivecloud/tucdrivecloud-documentation/-/wikis/home) for documentation (**work in progress**).

## Coding guidelines

When developing the TUC SmartCityCloud website, the following coding guidelines are **binding**:
 * the project uses eslint to ensure a consistent code formatting (code formatting errors which violate the rules are handled as compile errors and **must not** be committed). The enforced rules are the [Javascript Standard Style](https://standardjs.com/rules.html).
 * to keep bundle and chunk sizes (and thus loading times) low, code splitting and [lazy loading](https://router.vuejs.org/guide/advanced/lazy-loading.html) of components should be used where reasonable
 * prefer using [local imports](https://vuejs.org/v2/guide/components-registration.html#Local-Registration-in-a-Module-System) in vue.js components instead of imports in main.js, especially for rarely used components/packages
 * server access needs to be implemented using the [repository pattern](https://medium.com/backenders-club/consuming-apis-using-the-repository-pattern-in-vue-js-e64671b27b09), i.e. *no http get/post code* in vue components
 * communication errors have to be handled gracefully and need to be signaled to the user
 * new files/classes have to be integrated in the existing src folder hierarchy

## Building

The website is build using node.js and [vite](vitejs.dev). To install all dependencies when setting it up on a new machine, run `npm install`

To build it run `npm run build`. The public files will be placed in the */dist* folder.

For further information please see the documentation on [Setting up the website](https://gitlab.hrz.tu-chemnitz.de/tuc-drivecloud/tucdrivecloud-documentation/-/wikis/local-setup#setting-up-the-web-site).

## Testing & Debugging

A hotswap capable development server can be run using `npm run dev`. By default it listens on http://localhost:8080.
In development mode the [API server](https://gitlab.hrz.tu-chemnitz.de/tuc-drivecloud/tucdrivecloud-web-server) is expected to be running and listening on http://localhost:3333.