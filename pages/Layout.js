import React from 'react'
import PropTypes from 'prop-types'
import {Helmet} from 'react-helmet'
import styled from 'styled-components'

const Layout = ({className, children}, context) => (
  <div className={className}>
    {children}
  </div>
)

const StyledLayout = styled(Layout)`
  font-family: Consolas, monaco, monospace;
`

StyledLayout.contextTypes = {
  sheet: PropTypes.object,
}

export default (props, context) => <StyledLayout {...props} {...context} />