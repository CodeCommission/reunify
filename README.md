# Reunify

> A simple framework for server-rendered React applications.

## How to use

Install it:

```
$ mkdir myapp
$ cd myapp
$ npm init
$ npm install reunify --save
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "reunify"
  }
}
```

After that, the file-system is the main API. Every `.js` file becomes a route that gets automatically processed and rendered.

Populate `./pages/Index.js` inside your project:

```jsx
import React from 'react'
export default () => (<div>Welcome to Reunify!</div>)
```

and then just run `npm run dev` and go to `http://localhost:3000`

So far, we get:

- Automatic transpilation and bundling (with webpack and babel)
- Server rendering and indexing of `./pages`
- Static file serving. `./static/` is mapped to `/static/`

To see how simple this is, check out the [Example App]()
