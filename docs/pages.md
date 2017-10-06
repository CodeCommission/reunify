# Pages

* [First basic page](#first-basic-page)
* [More pages and how the routing works](#more-pages-and-how-the-routing-works)

## First basic page

First of all, the file-system is the main API. Every `.js` file becomes a route that gets automatically processed and rendered.

Populate `./pages/Index.js` inside your project:

```jsx
import React from 'react'
export default () => (<div>Welcome to Reunify!</div>)
```

and then just run `npm run dev` and go to `http://localhost:3000`

* Automatic transpilation and bundling (with WebPack and Babel)
* Hot Module Replacement in Development
* Server rendering and indexing of `./pages`
* Import exisiting CSSs files
* Full control of HTML `<head>` links, styles, scripts, title and meta with [`<Helmet>`](https://github.com/nfl/react-helmet)
* Static file serving. `./static/` is mapped to `/static/`
* CSS with awesome [Styled-Components](https://github.com/styled-components/styled-components)
* Full support of [Progressive Web Application](https://developers.google.com/web/progressive-web-apps/) via ServiceWorkers in Development
* Export a stand-alone Single-Page-App without Server-Side-Rendering

## More pages and how the routing works

> TBD