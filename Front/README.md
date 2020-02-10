# To Run the App locally

- Navigate to environments folder -> Open environments.ts

- Add the Api Gateway staging link with the resource name in trainApiUrl 
(example: trainApiUrl: 'https://abcde.execute-api.us-east-1.amazonaws.com/test/get-availability')

- Add the Api Key in the availiblityKey variable
(example: availiblityKey: 'abcdefgabcdefgabcdefg')

- Open a command prompt window and navigate to the TrainAvailability folder

- Use the command 'ng serve -o' to run the app locally

* The API Gateway and API Key can be found in AWS Console by going to the Gateway menu and searching for picoquery

# App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.3.

## Development server

Run `ng serve -o` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
