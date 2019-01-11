import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import BigNumber from 'bignumber.js';

import { actionCreators } from '../reducers/book';
import HeaderRow from '../components/HeaderRow';
import BookRow from '../components/BookRow';

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribed: false,
      subscribing: true,
    };
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
      // Not user's action => subscribe again
      console.error(err);
      this.subscribe();
    }
  }

  onOpen = () => {
    const openMsg = JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol: 'tBTCUSD',
    });
    this.ws.send(openMsg);
  }

  onMessage = (msg) => {
    const { initBook, updateBook } = this.props;
    const parsed = JSON.parse(msg.data);
    if (parsed.event === 'subscribed') {
      this.setState({ subscribed: true, subscribing: false });
      return;
    }
    const data = parsed[1];
    if (data && data !== 'hb') {
      if (Array.isArray(data[0])) {
        initBook(data);
      } else {
        updateBook(data);
      }
    }
  }

  onError = err => this.unsubscribe(err);

  toggleWebSocket = () => {
    if (this.ws) {
      this.unsubscribe();
    } else {
      this.subscribe();
    }
  }

  renderRow(side) {
    const { total } = this.props;
    const book = this.props[side]; // eslint-disable-line

    if (!book) return 'Fetching..';

    let acc = new BigNumber(0);
    return book.toArray().map(([, order]) => {
      const [price, , amount] = order;
      acc = acc.plus(amount);
      const percent = acc.abs().dividedBy(total).times(100).toFixed(0);
      return (
        <BookRow
          key={`${price}${amount}`}
          side={side}
          order={order}
          acc={acc}
          percent={percent}
        />
      );
    });
  }

  render() {
    const { subscribed, subscribing } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col-1">
            <HeaderRow side="bids">
              <p className="count">Count</p>
              <p>Amount</p>
              <p>Total</p>
              <p className="price">Price</p>
            </HeaderRow>
            {this.renderRow('bids')}
          </div>
          <div className="col-1">
            <HeaderRow side="asks">
              <p className="price">Price</p>
              <p>Amount</p>
              <p>Total</p>
              <p className="count">Count</p>
            </HeaderRow>
            {this.renderRow('asks')}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          {subscribing
            ? 'Subscribing..'
            : (
              <button onClick={this.toggleWebSocket} type="button">
                {subscribed ? 'Disconnect' : 'Connect'}
              </button>
            )
          }
        </div>
      </div>
    );
  }
}

Book.propTypes = {
  initBook: PropTypes.func.isRequired,
  bids: PropTypes.instanceOf(Map), // eslint-disable-line
  asks: PropTypes.instanceOf(Map), // eslint-disable-line
  updateBook: PropTypes.func.isRequired,
  total: PropTypes.instanceOf(BigNumber).isRequired,
};

function mapStateToProps(state) {
  return {
    bids: state.book.bids,
    asks: state.book.asks,
    total: (new BigNumber(state.book.asksTotal))
      .abs()
      .plus(state.book.bidsTotal),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initBook: orders => dispatch(actionCreators.initBook(orders)),
    updateBook: order => dispatch(actionCreators.updateBook(order)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Book);
