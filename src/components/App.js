import React from 'react';
import { connect } from 'react-redux';

import Ticker from './Ticker';
import Book from './Book';
import Trades from './Trades';

const App = () => (
  <div className="App">
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
  </div>
);

function mapStateToProps(state) {
  return {
    ticker: state.ticker,
  };
}

export default connect(mapStateToProps)(App);
