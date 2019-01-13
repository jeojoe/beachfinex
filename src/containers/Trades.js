import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { actionCreators } from '../reducers/trades';
import HeaderRow from '../components/HeaderRow';
import ControlRow from '../components/ControlRow';
import WSAction from '../components/WSAction';
import withWebSocket, { propTypesWS } from '../hocs/withWebSocket';

const getOpenMsg = () => ({
  event: 'subscribe',
  channel: 'trades',
  symbol: 'tBTCUSD',
});

const TradeRow = styled(HeaderRow)`
  & p {
    color: ${props => (props.amount >= 0 ? 'lime' : 'red')};
    font-size: 14px;
  }
`;

export class Trades extends React.Component {
  componentDidMount() {
    const { ws } = this.props;
    ws.subscribe({
      newOpenMsg: getOpenMsg(),
      newOnMessage: this.onMessage,
    });
  }

  onMessage = (msg) => {
    const { initTrades, updateTrades, ws } = this.props;
    // listen to 'te' for speed
    // http://blog.bitfinex.com/api/websocket-api-update/
    const parsed = JSON.parse(msg.data);
    if (parsed.event === 'subscribed') {
      ws.subscribeSuccess();
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

  renderControl() {
    const { ws } = this.props;
    return (
      <ControlRow>
        <WSAction
          subscribed={ws.subscribed}
          subscribing={ws.subscribing}
          toggle={ws.toggle}
        />
      </ControlRow>
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
        {this.renderControl()}
      </div>
    );
  }
}

Trades.propTypes = {
  trades: PropTypes.instanceOf(List), // eslint-disable-line
  initTrades: PropTypes.func.isRequired,
  updateTrades: PropTypes.func.isRequired,
  ws: PropTypes.shape(propTypesWS).isRequired,
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

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withWebSocket,
);

export default enhance(Trades);
