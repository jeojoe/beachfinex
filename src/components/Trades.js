import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { actionCreators } from '../reducers/trades';

// function getTradeRowBg(amount) {
//   const opacity = Math.abs(amount) / 50;
//   return amount >= 0 ? `rgba(255,0,0,${opacity})` : `rgba(0,255,0,${opacity})`;
// }

const HeaderRow = styled.div`
  display: flex;
  padding: 0 5px;
  & p {
    color: #fff;
    font-weight: bold;
    font-size: 12px;
    flex: 25%;
    margin: 0 5px;
  }
`;

const TradeRow = styled(HeaderRow)`
  & p {
    color: ${props => (props.amount >= 0 ? 'lime' : 'red')};
    font-size: 14px;
  }
`;

class Trades extends React.Component {
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
      channel: 'trades',
      symbol: 'tBTCUSD',
    });
    this.ws.send(openMsg);
  }

  onMessage = (msg) => {
    const { initTrades, updateTrades } = this.props;
    // listen to 'te' for speed
    // http://blog.bitfinex.com/api/websocket-api-update/
    const data = JSON.parse(msg.data);
    if (data[1] && data[1] !== 'hb' && data[1] !== 'tu') {
      if (data[1] !== 'te') {
        initTrades(data[1]);
      } else {
        updateTrades(data[2]);
      }
    }
  }

  onError = err => console.log(err);

  renderRow() {
    const { trades } = this.props;

    if (!trades) return 'Fetching..';

    return trades.map(([id, timestamp, amount, price]) => {
      return (
        <TradeRow key={id} amount={amount}>
          <p>{dayjs(timestamp).format('HH:mm:ss')}</p>
          <p>{Math.abs(amount)}</p>
          <p>{price}</p>
        </TradeRow>
      );
    });
  }

  render() {
    return (
      <div>
        <HeaderRow>
          <p>Time</p>
          <p>Amount</p>
          <p>Price</p>
        </HeaderRow>
        <div>{this.renderRow()}</div>
      </div>
    );
  }
}

Trades.propTypes = {
  trades: PropTypes.instanceOf(List), // eslint-disable-line
  initTrades: PropTypes.func.isRequired,
  updateTrades: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    trades: state.trades,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initTrades: orders => dispatch(actionCreators.initTrades(orders)),
    updateTrades: order => dispatch(actionCreators.updateTrades(order)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Trades);
