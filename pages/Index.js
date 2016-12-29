import React from 'react'
import { Link } from 'react-router'
import { style } from 'glamor'
import fetch from 'isomorphic-fetch'

export default class extends React.Component {
  static getInitialProps () {
    return Promise.resolve([])
  }

  render () {
    return (
      <div className={style(styles.content)}>
        <h1>Welcome to Reunify!</h1>
        <p>Modify this page with your own content!</p>
      </div>
    )
  }
}

const styles = {
  body: {
    border: '1px solid black',
    height: '100vh',
    width: '100%',
  }
}
