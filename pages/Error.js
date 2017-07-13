import React from 'react'

export default props => (
  <div>
    <h1>500 | Error</h1>
    {
      process.env.NODE_ENV !== 'production' &&
      props.error &&
      <p>{props.error.stack}</p>
    }
  </div>
)
