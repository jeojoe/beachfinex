import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { actionCreators } from '../reducers/trades';

class Trades extends React.Component {
  componentDidMount() {
    const { initTrades, updateTrades } = this.props;
    const ws = new WebSocket('wss://api.bitfinex.com/ws/2');
    ws.onopen = () => {
      const openMsg = JSON.stringify({
        event: 'subscribe',
        channel: 'trades',
        symbol: 'tBTCUSD',
      });
      ws.send(openMsg);
    };
    ws.onmessage = (msg) => {
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
    };
    ws.onerror = err => console.log(err);
  }

  renderRow() {
    const { trades } = this.props;

    if (!trades) return 'Fetching..';

    return trades.map((order) => {
      const [id, timestamp, amount, price] = order;
      return (
        <div key={id}>
          <p>
            {timestamp}
            -
            {amount}
            -
            {price}
          </p>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div>{this.renderRow()}</div>
      </div>
    );
  }
}

Trades.propTypes = {
  trades: PropTypes.instanceOf(Map), // eslint-disable-line
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
