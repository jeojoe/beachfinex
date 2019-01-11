import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actionCreators } from '../reducers/ticker';

class Ticker extends React.Component {
  componentDidMount() {
    const { setTicker } = this.props;
    const ws = new WebSocket('wss://api.bitfinex.com/ws/2');
    ws.onopen = () => {
      const openMsg = JSON.stringify({
        event: 'subscribe',
        channel: 'ticker',
        symbol: 'tBTCUSD',
      });
      ws.send(openMsg);
    };
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)[1];
      if (data && data !== 'hb') {
        setTicker(data);
      }
    };
    ws.onerror = err => console.log(err);
  }

  render() {
    const { ticker } = this.props;

    return (
      <div>{ ticker.lastPrice }</div>
    );
  }
}

Ticker.propTypes = {
  ticker: PropTypes.shape({
    bid: PropTypes.number,
    bidSize: PropTypes.number,
    ask: PropTypes.number,
    askSize: PropTypes.number,
    dailyChange: PropTypes.number,
    dailyChangePerc: PropTypes.number,
    lastPrice: PropTypes.number,
    volume: PropTypes.number,
    high: PropTypes.number,
    low: PropTypes.number,
  }).isRequired,
  setTicker: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    ticker: state.ticker,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTicker: rawTicker => dispatch(actionCreators.setTicker(rawTicker)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Ticker);
