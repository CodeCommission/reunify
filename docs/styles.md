# Apply static and dynamic styles

* [Static CSS](#static-css)
* [Dynamic styles with Styled-Components](#dynamic-styles-with-styled-components)

## Static CSS

> TBD

## Dynamic styles with Styled-Components

```javascript
import React from 'react'
import styled from 'styled-components'

const StyledBox = styled.div`
  border: 1px solid gray;
  margin: 5px;
  padding: 5px;
`

export default props => <StyledBox>Hello World</StyledBox>
```