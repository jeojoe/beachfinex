import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const App = ({ ticker }) => (
  <div className="App">
    <header className="App-header">
      {ticker}
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

App.propTypes = {
  ticker: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    ticker: state.ticker,
  };
}

export default connect(mapStateToProps)(App);
