import React from 'react'
import styled from 'styled-components'

const Layout = ({className, children}, context) => (
  <div className={className}>
    {children}
  </div>
)

const StyledLayout = styled(Layout)`
  font-family: Consolas, monaco, monospace;
`

export default (props, context) => <StyledLayout {...props} {...context} />