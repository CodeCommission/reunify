import React, {PureComponent} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import './Index.css';

const StyledMain = styled.div`
  padding: 5px;
  height: 100vh;
  width: 100%;
`;

StyledMain.contextTypes = {sheet: PropTypes.object};

export default class Index extends PureComponent {
  static async getInitialProps() {
    return {};
  }

  render() {
    return (
      <StyledMain>
        <h1>Welcome to Reunify!</h1>
        <p>Modify this page with your own content!</p>
      </StyledMain>
    );
  }
}
