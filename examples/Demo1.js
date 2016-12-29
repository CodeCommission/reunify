import React from 'react'
import { Link } from 'react-router'
import 'isomorphic-fetch'

export default class Demo1 extends React.Component {
  state = {
    foo: 'Click to get current date and time!'
  }

  static getInitialProps() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve({mydata: 'hello world demo 1'})
      }, 1000)
    })
  }

  componentWillMount() {
    // console.log('WILL MOUNT')
  }

  componentWillReceiveProps(nextProps) {
    // console.log('RECEIVE PROPS')
  }

  render() {
    return (
      <div>
        <h1>Demo 1</h1>
        <h2>{ this.state.foo }</h2>
        <button onClick={() => this.setState({foo: new Date().toUTCString()})}>Click Me</button>
        <h2>{ this.props.mydata }</h2>
      </div>
    )
  }
}
