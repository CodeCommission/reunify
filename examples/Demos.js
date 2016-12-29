import React from 'react'
import { Link } from 'react-router'

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <h1>Index</h1>
        <ul>
          <li><Link to={`/demo1`}>Client-Side Demo 1</Link></li>
          <li><Link to={`/demo2`}>Client-Side Demo 2</Link></li>
        </ul>
        <ul>
          <li><a href="/demo1">Server-Side Demo 1 (1s delay)</a></li>
          <li><a href="/demo2">Server-Side Demo 2 (1s delay)</a></li>
        </ul>
      </div>
    )
  }
}
