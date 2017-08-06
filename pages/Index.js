import React from 'react'
import styled from 'styled-components'

const Main = ({className}) => (
  <div className={className}>
    <h1>Welcome to Reunify!</h1>
    <p>Modify this page with your own content!</p>
  </div>
)

const StyledMain = styled(Main)`
  padding: 5px;
  height: 100vh;
  width: 100%;
`

export default class extends React.Component {
  static async getInitialProps () {
    return {}
  }

  render () {
    return <StyledMain />
  }
}
