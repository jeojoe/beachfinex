import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actionCreators } from '../reducers/ticker';
import BTC from '../images/BTC.png';

const Logo = styled.img`
  width: 50px;
  height: 50px;
  margin-top: 15px;
  margin-left: 20px;
`;

const Pair = styled.h1`
  color: #fff;
  margin-left: 15px;
  background: url()
`;

const Label = styled.p`
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Value = styled.p`
  color: ${props => props.color || '#fff'};
  display: inline;
  margin-top: 0;
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
`;

export class Ticker extends React.Component {
  componentDidMount() {
    document.title = 'BTC-USD | Beachfinex';
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
    const {
      ticker: {
        dailyChange,
        dailyChangePerc,
        lastPrice,
        volume,
        high,
        low,
      },
    } = this.props;

    if (!lastPrice) return 'Fetching..';

    document.title = `BTC-USD ${lastPrice.toFixed(1)} | Beachfinex`;

    return (
      <div className="row justify-between">
        <div className="row">
          <Logo src={BTC} alt="BTC Logo" width="50" height="50" />
          <Pair>BTC/USD</Pair>
        </div>
        <div className="row align-center">
          <div className="col-1 ticker">
            <Label>Last Price</Label>
            <Value>{lastPrice.toFixed(1)}</Value>
          </div>
          <div className="col-1 ticker">
            <Label>Change 24hr</Label>
            <Value
              color={dailyChange >= 0 ? 'lime' : 'red'}
            >
              {dailyChange.toFixed(2)} ({dailyChangePerc.toFixed(2)}%)
            </Value>
          </div>
          <div className="col-1 ticker">
            <Label>High 24hr</Label>
            <Value>{high.toFixed(1)}</Value>
          </div>
          <div className="col-1 ticker">
            <Label>Low 24hr</Label>
            <Value>{low.toFixed(1)}</Value>
          </div>
          <div className="col-1 ticker">
            <Label>Volume 24hr</Label>
            <Value>{volume.toFixed(2)}</Value>
          </div>
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
