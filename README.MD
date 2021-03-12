# NodeJS Shopping Cart - NodeJS, Express, Express-Session, Express handlebars (hbs)

### Debug Config Examples and Information

This fork is for a demonstration of the debugging tools available in VSCode. This repo contains vscode-recipie's example node app setup with various debug configurations. Pull down this repo and run locally following the below instructions to try these configs out for yourself. Feel free to modify them and see how they affect things. Use VSCode's intellisense (`Ctrl+Space`) to learn more about individual debug settings. For an overview of all the debug configs/files and examples in this repo, many of which you can use as templates for other projects, see [this page about the debug examples/configs.](/debugexamples.md)

**A quick note about debugging asynchronous code:** When stepping through lines of code with a debugger, when you encounter callback functions being passed in or callbacks supplied as lambdas, your debugger will not step into those since they will be executed at a later time. If you want to debug the code inside these callbacks/lambdas, set a breakpoint inside the callback/lambda. You shouldn't have to restart the application for the new breakpoint to be hit. Typically, you will just have to let the program continue normal execution past the current function before the callback will be executed. A similar behavior exists when the callback is in response to an event. This ***does not*** apply to code that is executed when stepping over a line with an `await` statement (when using async/await). Stepping over lines with `await` in them will generally behave as you would expect. You should also be able to step into an `await`ed function call so long as your debug config has `"skipFiles": ["<node_internals>/**"]` or something of a similar effect in it. The debug config examples in this repo are generally setup with this already configured, so you shouldn't have to worry about stepping through any node internal code first. If you want to read more about why `skipFiles` is used relation to this behavior, refer to [this stackoverflow article](https://stackoverflow.com/questions/37771097/how-to-debug-async-await-in-visual-studio-code).

### Run locally on your machine

You need to have installed Node and NPM.

![NodeJS Shopping Cart](/data/nodejs-cart-1.png?raw=true 'NodeJS Shopping Cart')

Clone this repository

```shell
git clone https://github.com/gtsopour/nodejs-shopping-cart.git
```

Install dependencies

```shell
npm install
```

Start NodeJS server at http://localhost:3000

```shell
npm start
```

For Nodemon usage

```shell
nodemon ./bin/www
```

### Technologies

NodeJS, Express, Express-Session, Nodemon, hbs - Express.js view engine for handlebars.js

For any extra questions, please contact me at gtsopour@gmail.com.
