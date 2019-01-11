import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actionCreators } from '../reducers/ticker';

const Pair = styled.h1`
  color: #fff;
  margin-left: 5px;
  margin-right: 30px;
`;

const Label = styled.p`
  color: #fff;
`;

const Value = styled.p`
  color: #fff;
`;

class Ticker extends React.Component {
  constructor(props) {
    super(props);
    this.ws = new WebSocket('wss://api.bitfinex.com/ws/2');
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;
  }

  onOpen = () => {
    const openMsg = JSON.stringify({
      event: 'subscribe',
      channel: 'ticker',
      symbol: 'tBTCUSD',
    });
    this.ws.send(openMsg);
  }

  onMessage = (msg) => {
    const { setTicker } = this.props;
    const data = JSON.parse(msg.data)[1];
    if (data && data !== 'hb') {
      setTicker(data);
    }
  }

  onError = err => console.log(err);

  render() {
    const { ticker } = this.props;

    if (!ticker.lastPrice) return 'Fetching..';

    return (
      <div className="row">
        <Pair>BTC/USD</Pair>
        <div className="col-1">
          <Label>Last Price</Label>
          <Value>{ticker.lastPrice}</Value>
        </div>
        <div className="col-1">
          <Label>Change 24hr</Label>
          <Value>{ticker.dailyChange} ({ticker.dailyChangePerc})</Value>
        </div>
        <div className="col-1">
          <Label>High 24hr</Label>
          <Value>{ticker.high}</Value>
        </div>
        <div className="col-1">
          <Label>Low 24hr</Label>
          <Value>{ticker.low}</Value>
        </div>
        <div className="col-1">
          <Label>Volume 24hr</Label>
          <Value>{ticker.volume}</Value>
        </div>
      </div>
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
