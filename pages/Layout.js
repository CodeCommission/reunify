import React, {PureComponent} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledLayout = styled.div`
  font-family: Consolas, monaco, monospace;
`;

StyledLayout.contextTypes = {sheet: PropTypes.object};

export default class Layout extends PureComponent {
  render() {
    return <StyledLayout>{this.props.children}</StyledLayout>;
  }
}
