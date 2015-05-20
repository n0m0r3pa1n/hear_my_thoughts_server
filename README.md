## [Gulp, Babel, Nodemon server solution](https://github.com/n0m0r3pa1n/babel_hapijs_server_template) - Example Project

### Installation

Install nodemon to watch the js files for you and restart the server:

```
npm install -g nodemon
```

After cloning the repository, install dependencies:
```
cd <project folder>
npm install
```

Now you can run your local server:
```
gulp // Use it in a separate tab to constantly rebuild files
npm start // Starts nodemon watching the transformed js files
```

Make request to "/devs" route to create and get the current developers.

### Libraries

This project uses:

  * [Co](https://www.npmjs.com/package/co) - for generator functions
  * [Babel](https://www.npmjs.com/package/babel) - for ES6 to ES5 translation
  * [Mongoose](https://www.npmjs.com/package/mongoose) - for db queries
  * [Gulp](https://www.npmjs.com/package/gulp) - build task system
  * [Nodemon](https://www.npmjs.com/package/nodemon) - watching files
  * [HapiJS](https://www.npmjs.com/package/hapi) - node server

### Tricky parts

1. Babel "Regenerator" runtime is blacklisted so I can use the "Co" library. This can be found in the gulpfile.js
2. In index.js every route handler is wrapped with the Co library so it can support generator functions
