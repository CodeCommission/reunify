# Reunify

> A simple framework for server-rendered ReactJS progressive web applications.

## How to use

__Installation:__

```bash
npm install -g reunify
reunify create my-app
cd my-app
npm run dev
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
