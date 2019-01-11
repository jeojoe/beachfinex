import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Ticker from './Ticker';
import Book from './Book';
import Trades from './Trades';

import beach from '../images/beach.jpg';

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  background-position: bottom;
  background-size: cover;
  background-image: url('${beach}');
  overflow-y: scroll;
`;

const App = () => (
  <Background>
    <header className="App-header">
      <Trades />
      <Ticker />
      <Book />
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </Background>
);

function mapStateToProps(state) {
  return {
    ticker: state.ticker,
  };
}

export default connect(mapStateToProps)(App);
