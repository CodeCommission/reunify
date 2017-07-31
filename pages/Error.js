import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledError = styled.div`
  font-family: Consolas, monaco, monospace;
`
StyledError.contextTypes = {
  sheet: PropTypes.object,
}

export default props => (
  <StyledError>
    <h1>500 | Server Error</h1>
    {
      props.error &&
      process &&
      process.env &&
      process.env.NODE_ENV !== 'production' &&
      <p>{props.error.stack}</p>
    }
  </StyledError>
)
