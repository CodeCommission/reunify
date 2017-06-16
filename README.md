# Reunify

> Simplified creation of universal ReactJS progressive web applications.

## Features

* Server-side rendered ReactJS
* Best bits of ES6 and ES7 supported
* Powerful component based CSS via [Styled-Components](https://www.styled-components.com/)
* Simplified routing on server and client side
* Reliable and Fast with integrated Progressive Web Application support
* Serves static content easily

## Setup & Run

Firstly, install it:

```bash
npm i -g reunify
```

Create your first universal ReactJS PWA:

```bash
reunify create awesome-app
```

Serve locally:

```bash
cd awesome-app
npm run dev
```

## How to use

After that, the file-system is the main API. Every `.js` file becomes a route that gets automatically processed and rendered.

Populate `./pages/Index.js` inside your project:

```jsx
import React from 'react'
export default () => (<div>Welcome to Reunify!</div>)
```

and then just run `npm run dev` and go to `http://localhost:3000`

So far, we get:

* Automatic transpilation and bundling (with webpack and babel)
* Server rendering and indexing of `./pages`
* Static file serving. `./static/` is mapped to `/static/`

To see how simple this is, check out the [Example Apps](https://github.com/CodeCommission/reunify-examples)

## Deploy it to the cloud with [DropStack](https://dropstack.run)

```bash
npm i -g dropstack-cli
cd awesome-app
dropstack login
dropstack deploy
```
