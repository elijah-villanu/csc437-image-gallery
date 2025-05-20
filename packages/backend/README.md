# Silas's Express.js Starter
You may use this template for both your labs and your project in CSC 437.  Let's take a tour so you can more easily customize the server to your needs.

## src/
All source code should be placed in this folder.  Currently it just has index.ts, the most basic Express.js server there is, written in TypeScript.  The rest of the stuff in this package is configured to compile TypeScript (TS) files into JS files and run them.  We will learn more about TypeScript in the next reading.

## package.json
package.json also allows you to run the following scripts:
* `npm run dev`: starts the server in development mode.
* `npm run build`: runs the TypeScript compiler and puts the compiled files in the dist/ folder.
* `npm run start`: runs the build script and then starts the server in production mode.

Behind these scripts are the following dependencies:

* dotenv: reads environment variables specified in .env files.  We will discuss environment variables more in later readings.
* express: Express.js, the server framework we are using
* @types/express, @types/node: TypeScript definitions for Express.js and Node.js's inbuilt libraries.
* nodemon: **node mon**itor, a file system watcher that runs commands if watched files change.  We use it to auto-restart the server if its source code changes in development mode.
* typescript: TypeScript-to-JS compiler.

## nodemon.json
This is the config for restarting the server when files change in development mode.

* watch: folders to watch for changes
* ignore: folders to ignore changes in.  Note that node_modules is included.  (Node.js installs dependencies into node_modules.)  This means if you npm install something, you must stop the "npm run dev" command and re-run it.
* ext: file extensions to watch for changes.
* exec: the command to execute each time file(s) change.  "tsc" stands for TypeScript compiler.

## tsconfig.json
Configuration for the TypeScript compiler.  [TypeScript has a LOT of options](https://www.typescriptlang.org/tsconfig/).  I don't expect you to need to change this config.

