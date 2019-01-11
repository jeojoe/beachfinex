import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { actionCreators } from '../reducers/book';

class Book extends React.Component {
  componentDidMount() {
    const { initBook } = this.props;
    const ws = new WebSocket('wss://api.bitfinex.com/ws/2');
    ws.onopen = () => {
      const openMsg = JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD',
      });
      ws.send(openMsg);
    };
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)[1];
      if (data && data !== 'hb') {
        if (Array.isArray(data[0])) {
          initBook(data);
        } else {
          console.log('lol');
        }
      }
    };
    ws.onerror = err => console.log(err);
  }

  renderRow(side) {
    const book = this.props[side]; // eslint-disable-line

    if (!book) return 'Fetching..';

    return book.toArray().map(([, order]) => {
      const [price, count, amount] = order;
      return (
        <div>
          <p>{price}</p>
          <p>{amount}</p>
          <p>{count}</p>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div>{this.renderRow('bids')}</div>
        <div>{this.renderRow('asks')}</div>
      </div>
    );
  }
}

Book.propTypes = {
  initBook: PropTypes.func.isRequired,
  bids: PropTypes.instanceOf(Map), // eslint-disable-line
  asks: PropTypes.instanceOf(Map), // eslint-disable-line
};

function mapStateToProps(state) {
  return {
    bids: state.book.bids,
    asks: state.book.asks,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initBook: orders => dispatch(actionCreators.initBook(orders)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Book);