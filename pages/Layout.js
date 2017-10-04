import React from 'react'
import styled from 'styled-components'

const StyledLayout = styled.div`
  font-family: Consolas, monaco, monospace;
`

export default class Layout extends React.Component {
  render () {
    return (
      <StyledLayout>{this.props.children}</StyledLayout>
    )
  }
}
