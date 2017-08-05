# Reunify

> Simplified creation of universal ReactJS progressive web applications.

## Features

* Server-side rendered ReactJS
* Best bits of ES6 and ES7 supported
* Simplified routing on server and client side
* Reliable and Fast with integrated Progressive Web Application support
* Serves static content easily
* Powerful component based CSS via [Styled-Components](https://www.styled-components.com/)
* Full control of
  * Resquest/Response ([Express](https://github.com/expressjs/express))
  * HTML Head ([Helmet](https://github.com/helmetjs/helmet))
  * Cookies ([React-Cookies](https://github.com/reactivestack/cookies))

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
* Hot Module Replacement in Development
* Server rendering and indexing of `./pages`
* Import exisiting CSSs files
* Full control of HTML `<head>` links, styles, scripts, title and meta with [`<Helmet>`](https://github.com/nfl/react-helmet)
* Static file serving. `./static/` is mapped to `/static/`
* CSS with awesome [Styled-Components](https://github.com/styled-components/styled-components)
* Full support of [progressive web application](https://developers.google.com/web/progressive-web-apps/) via ServiceWorkers in Development
* Export a stand-alone Single-Page-App without Server-Side-Rendering

To see how simple this is, check out the [Example Apps](https://github.com/CodeCommission/reunify-examples)

### Fetch / Load / Get data with functional components

```javascript
import React from 'react'

export const RepoList = props => (
  <ul>
    {
      props.repos &&
      props.repos.map((x, i) => <li key={i}><a href={x.html_url} taget="_blank">{x.name}</a></li>)
    }
  </ul>
)

RepoList.getInitialProps = async (req, res) => {
  const response = await fetch('https://api.github.com/users/codecommission/repos')
  const data = await response.json()
  const repos = data && data.filter(x => x.name.indexOf('reunify') !== -1)
  return { repos }
}

RepoList.displayName = 'RepoList'

export default RepoList
```

### Fetch / Load / Get data with class components

```javascript
import React from 'react'

export default class RepoList extends React.PureComponent {
  static async getInitialProps (req, res) {
    const response = await fetch('https://api.github.com/users/codecommission/repos')
    const data = await response.json()
    const repos = data && data.filter(x => x.name.indexOf('reunify') !== -1)
    return {repos}
  }

  render () {
    return (
      <div>
        <h1>Reunify GitHub Repositories</h1>
        <StyledList>
          {
            this.props.repos &&
            this.props.repos.map((x, i) => <li key={i}><StyledLink href={x.html_url} taget="_blank">{x.name}</StyledLink></li>)
          }
        </StyledList>
      </div>
    )
  }
}
```

### CSS with Styled-Components

```javascript
import React from 'react'
import styled from 'styled-components'

const StyledBox = styled.div`
  border: 1px solid gray;
  margin: 5px;
  padding: 5px;
`
export default props => <StyledBox>Hello World</StyledBox>
```

### Export without Server-Side-Rendering

Just enter:

```bash
npm run export
```

Your application was exported in `dist` folder.

To get a full deployable (with an integrated SPA enabled HTTP server and package.json) just enter:

```bash
npm run export:package
```

Run a fterwards with:

```bash
cd dist
npm run dev
```

## Deploy it to the cloud with [DropStack](https://dropstack.run)

```bash
npm i -g dropstack-cli
cd awesome-app
dropstack login
dropstack deploy
```

## How to use it in my project?

Being stable and inventive and have a look to our [Reunify examples](https://github.com/codecommission/reunify-examples).

## Contributors

Every participation is welcome. Check them out [here](https://github.com/codecommission/reunify/graphs/contributors).

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public [GitHub issue tracker](https://github.com/codecommission/reunify/issues).

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

## Thanks

You like this and you want to see what coming next? Follow me on Twitter [`@mikebild`](https://twitter.com/mikebild).

Enjoy!
