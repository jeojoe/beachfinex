import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { actionCreators } from '../reducers/ticker';
import withWebSocket, { propTypesWS } from '../hocs/withWebSocket';

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

const getOpenMsg = () => ({
  event: 'subscribe',
  channel: 'ticker',
  symbol: 'tBTCUSD',
});

export class Ticker extends React.Component {
  componentDidMount() {
    const { ws } = this.props;
    ws.subscribe({
      newOpenMsg: getOpenMsg(),
      newOnMessage: this.onMessage,
    });
  }

  onMessage = (msg) => {
    const { setTicker, ws } = this.props;
    const parsed = JSON.parse(msg.data);
    if (parsed.event === 'subscribed') {
      ws.subscribeSuccess();
      return;
    }
    const data = parsed[1];
    if (data && data !== 'hb') {
      setTicker(data);
    }
  }

  render() {
    const {
      dailyChange,
      dailyChangePerc,
      lastPrice,
      volume,
      high,
      low,
    } = this.props;

    if (!lastPrice) return 'Fetching..';

    document.title = `BTC/USD ${lastPrice.toFixed(1)} | Beachfinex`;

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
            <Label>24hr Change</Label>
            <Value
              color={dailyChange >= 0 ? 'lime' : 'red'}
            >
              {dailyChange.toFixed(2)} ({(dailyChangePerc * 100).toFixed(2)}%)
            </Value>
          </div>
          <div className="col-1 ticker">
            <Label>24hr High</Label>
            <Value>{high.toFixed(1)}</Value>
          </div>
          <div className="col-1 ticker">
            <Label>24hr Low</Label>
            <Value>{low.toFixed(1)}</Value>
          </div>
          <div className="col-1 ticker">
            <Label>24hr Volume</Label>
            <Value>{volume.toFixed(2)}</Value>
          </div>
        </div>
      </div>
    );
  }
}

Ticker.propTypes = {
  dailyChange: PropTypes.number.isRequired,
  dailyChangePerc: PropTypes.number.isRequired,
  lastPrice: PropTypes.number.isRequired,
  volume: PropTypes.number.isRequired,
  high: PropTypes.number.isRequired,
  low: PropTypes.number.isRequired,
  setTicker: PropTypes.func.isRequired,
  ws: PropTypes.shape(propTypesWS).isRequired,
};

function mapStateToProps(state) {
  return {
    dailyChange: state.ticker.dailyChange,
    dailyChangePerc: state.ticker.dailyChangePerc,
    lastPrice: state.ticker.lastPrice,
    volume: state.ticker.volume,
    high: state.ticker.high,
    low: state.ticker.low,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setTicker: rawTicker => dispatch(actionCreators.setTicker(rawTicker)),
  };
}

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withWebSocket,
);

export default enhance(Ticker);
