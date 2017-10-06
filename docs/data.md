# Data fetching and bindings

* [Functional Components](#functional-component)
* [Class Components](#class-component)

## Functional Component

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

RepoList.getInitialProps = async (req, res, ctx) => {
  const response = await fetch('https://api.github.com/users/codecommission/repos')
  const data = await response.json()
  const repos = data && data.filter(x => x.name.indexOf('reunify') !== -1)
  return { repos }
}

RepoList.displayName = 'RepoList'

export default RepoList
```

## Class Component

```javascript
import React from 'react'

export default class RepoList extends React.PureComponent {
  static async getInitialProps (req, res, ctx) {
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