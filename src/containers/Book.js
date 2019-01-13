import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';

import { actionCreators } from '../reducers/book';
import HeaderRow from '../components/HeaderRow';
import BookRow from '../components/BookRow';

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0 0;
`;

class Book extends React.Component {
  state = {
    subscribed: false,
    subscribing: true,
    precision: 'P0',
    zoom: 1,
  };

  componentDidMount() {
    this.lastRendered = Date.now();
    this.subscribe();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state !== nextState) return true;
    // Only 1 render per 0.25s
    const now = Date.now();
    const timeOk = now - this.lastRendered > 250;
    const bookFull = nextProps.bids && nextProps.bids.size === 25 && nextProps.asks.size === 25;
    if (bookFull && timeOk) {
      this.lastRendered = now;
      return true;
    }
    return false;
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
    const { precision } = this.state;
    const openMsg = JSON.stringify({
      event: 'subscribe',
      channel: 'book',
      symbol: 'tBTCUSD',
      prec: precision,
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

  changePrecision = (precision) => {
    const { precision: current } = this.state;
    if (precision !== current) {
      if (this.ws) this.unsubscribe();
      this.setState({ precision }, this.subscribe);
    }
  }

  zoomIn = () => this.setState(prev => ({
    zoom: prev.zoom < 3 ? prev.zoom + 0.1 : prev.zoom,
  }))

  zoomOut = () => this.setState(prev => ({
    zoom: prev.zoom > 0.3 ? prev.zoom - 0.1 : prev.zoom,
  }))

  renderRow(side) {
    const { total } = this.props;
    const { zoom } = this.state;
    const book = this.props[side]; // eslint-disable-line

    if (!book) return 'Fetching..';

    let acc = new BigNumber(0);
    return book.toArray().map(([, order]) => {
      const [price, , amount] = order;
      acc = acc.plus(amount);
      const percent = acc.abs().dividedBy(total)
        .times(100)
        .times(zoom)
        .toFixed(0);
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

  renderActions() {
    const { subscribed, subscribing, precision } = this.state;
    return (
      <ActionRow>
        <div>
          <b>{subscribed ? 'REAL-TIME' : 'OFFLINE' }</b>
          {' '}
          {subscribing
            ? '(Subscribing..)'
            : (
              <button onClick={this.toggleWebSocket} type="button">
                {subscribed ? 'Unsubscribe' : 'Subscribe'} Order Book
              </button>
            )
          }
        </div>
        <div>
          <button onClick={() => this.changePrecision('P0')} type="button">
            P0
          </button>
          <button onClick={() => this.changePrecision('P1')} type="button">
            P1
          </button>
          <button onClick={() => this.changePrecision('P2')} type="button">
            P2
          </button>
          <button onClick={() => this.changePrecision('P3')} type="button">
            P3
          </button>
          {' '}
          <b>Current Precision: {precision}</b>
        </div>
        <div>
          <button onClick={this.zoomIn} type="button">
            Zoom In +
          </button>
          <button onClick={this.zoomOut} type="button">
            Zoom out -
          </button>
        </div>
      </ActionRow>
    );
  }

  render() {
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
        {this.renderActions()}
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
