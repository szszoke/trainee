# HiQ Trainee program

Link to the problem: https://bitbucket.org/Gbodestad/hiq.traineeinterview/

### Assumptions

1.  Contractions such as "I'm" or "you've" are considered one word
2.  When a file contains multiple most used words of the same quantity, all of them are surrounded
3.  Multiple case styles (upper/lowercase) of a word are considered to be the same word
4.  Punctuation marks and special symbols except _ (underline) are not considered to be the part of the words and are ignored

### System requirements

-   Node.js 8.11 runtime
-   yarn

### Building

`yarn && yarn build`

### Demo

`yarn start`

### Technology stack

-   Node.js
-   Express.js
-   React
-   TypeScript
-   Webpack

### Motivation

The following tools/technologies are meant to provide a simple developmet workflow and fast and flexible code.

#### JavaScript/TypeScript

JavaScript is powerful and flexible but it's not type-safe. TypeScript is a typed superset of JavaScript. It provides type checking during compile time which significantly reduces the risk for bugs and results in more readable code.

#### async/await

Asynchronous functions simplify the use of `Promises` in a synchronous way.

Instead of this:
```typescript
findMostFrequentWords(
    file.path,
).then(words => {
    surroundOccurrences(
        res,
        file.path,
        words,
        prefix,
        postfix,
    ).then(() => {
        res.end();
    }).catch(() => {
        res.sendStatus(500);
    });
}).catch(() => {
    res.sendStatus(500);
});
```
We can now write this:
```typescript
try {
    const words = await findMostFrequentWords(
        file.path,
    );
    await surroundOccurrences(
        res,
        file.path,
        words,
        prefix,
        postfix,
    );
    res.end();
} catch (error) {
    res.sendStaus(500);
}
```
The code is much easier to read. No need to duplicat the error handling code, errors are handled with a single `try/catch` block.
#### React

React is a declarative JavaScript library for building user interfaces. It is very simple to use and very fast to get up and going. It has a huge community behind and an enormous selection of already existing solutions for many different problems.

#### Virtual rendering

The project uses the `react-virtualized` package to optimize the rendering of large files.

#### Webpack and Babel

Webpack is a popular module bundler for JavaScript applications. It supports both the browser and Node.js. It supports differend profiles for development and production. It is extensible with plugins to achieve flexibility.

Babel enables modern JavaScript features during development and transpiles them to code which every modern browser understands.

#### Node.js with Express

Node.js is already being used for bundling the frontend code so using it for the backend as well resulted in a simplified developer workflow. Code for both the frontend and backend can be written in the same environment, with the same tools and linters. 

Express.js is a fast and flexible web application framework running on top of Node.js. A simple HTTP server can be set up in just a couple of lines. The software interface is easy and intuitive. Additional functionality can be easily implemented using middlewares.

### Contact information

**Szabolcs Szőke**  
szszoke.code@gmail.com  
+46 79 306 35 92
