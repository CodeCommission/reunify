import React from 'react'
import styled from 'styled-components'

const StyledLayout = styled.div`
  font-family: Consolas, monaco, monospace;
`

export default ({children}) => <StyledLayout>{children}</StyledLayout>