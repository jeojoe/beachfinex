import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { actionCreators } from '../reducers/trades';
import HeaderRow from '../components/HeaderRow';

const ActionRow = styled.div`
  padding: 10px 0 0;
`;

const TradeRow = styled(HeaderRow)`
  & p {
    color: ${props => (props.amount >= 0 ? 'lime' : 'red')};
    font-size: 14px;
  }
`;

export class Trades extends React.Component {
  state = {
    subscribed: false,
    subscribing: true,
  };

  componentDidMount() {
    this.subscribe();
  }

  subscribe = () => {
    this.ws = new WebSocket('wss://api.bitfinex.com/ws/2');
    this.ws.onopen = this.onOpen;
    this.ws.onmessage = this.onMessage;
    this.ws.onerror = this.onError;
    this.setState({ subscribing: true });
  }

  unsubscribe = (err) => {
    this.ws.close();
    this.ws = null;
    this.setState({ subscribed: false });
    if (err) {
      // Has error, not user's action => subscribe again
      console.error(err);
      this.subscribe();
    }
  }

  toggleWebSocket = () => {
    if (this.ws) {
      this.unsubscribe();
    } else {
      this.subscribe();
    }
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
    const parsed = JSON.parse(msg.data);
    if (parsed.event === 'subscribed') {
      this.setState({ subscribed: true, subscribing: false });
      return;
    }
    const data = parsed;
    if (data[1] && data[1] !== 'hb' && data[1] !== 'tu') {
      if (data[1] !== 'te') {
        initTrades(data[1]);
      } else {
        updateTrades(data[2]);
      }
    }
  }

  onError = err => this.unsubscribe(err);

  renderRow() {
    const { trades } = this.props;

    if (!trades) return 'Fetching..';

    return trades.map(([id, timestamp, amount, price]) => (
      <TradeRow key={id} amount={amount}>
        <p>{dayjs(timestamp).format('HH:mm:ss')}</p>
        <p>{price}</p>
        <p>{Math.abs(amount)}</p>
      </TradeRow>
    ));
  }

  renderActions() {
    const { subscribed, subscribing } = this.state;
    return (
      <ActionRow>
        <b>{subscribed ? 'REAL-TIME' : 'OFFLINE' }</b>
        {' '}
        {subscribing
          ? '(Subscribing..)'
          : (
            <button onClick={this.toggleWebSocket} type="button">
              {subscribed ? 'Unsubscribe' : 'Subscribe'} Trades
            </button>
          )
        }
      </ActionRow>
    );
  }

  render() {
    return (
      <div>
        <HeaderRow>
          <p>Time</p>
          <p>Price</p>
          <p>Amount</p>
        </HeaderRow>
        <div>
          {this.renderRow()}
        </div>
        {this.renderActions()}
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
