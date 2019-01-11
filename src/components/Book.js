import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';

import { actionCreators } from '../reducers/book';

const BookRow = styled.div`
  display: flex;
  & p {
    flex: 1;
    color: #fff;
    margin: 2px 0;
    font-weight: bold;
    font-size: 14px;
  }
`;

class Book extends React.Component {
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
      channel: 'book',
      symbol: 'tBTCUSD',
    });
    this.ws.send(openMsg);
  }

  onMessage = (msg) => {
    const { initBook, updateBook } = this.props;
    const data = JSON.parse(msg.data)[1];
    if (data && data !== 'hb') {
      if (Array.isArray(data[0])) {
        initBook(data);
      } else {
        updateBook(data);
      }
    }
  }

  onError = err => console.log(err);

  renderRow(side) {
    const book = this.props[side]; // eslint-disable-line

    if (!book) return 'Fetching..';

    let acc = new BigNumber(0);
    return book.toArray().map(([, order]) => {
      const [price, count, amount] = order;
      acc = acc.plus(amount);
      const countStr = count.toFixed(0);
      const amountStr = Math.abs(amount).toFixed(2);
      const totalStr = acc.abs().toFixed(2);
      const priceStr = new BigNumber(price).toFixed(2);

      return (
        <BookRow key={order.price}>
          {side === 'bids'
            ? (
              <>
                <p>{countStr}</p>
                <p>{amountStr}</p>
                <p>{totalStr}</p>
                <p>{priceStr}</p>
              </>
            ) : (
              <>
                <p>{priceStr}</p>
                <p>{totalStr}</p>
                <p>{amountStr}</p>
                <p>{countStr}</p>
              </>
            )
          }
        </BookRow>
      );
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-1">
          {this.renderRow('bids')}
        </div>
        <div className="col-1">
          {this.renderRow('asks')}
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
    updateBook: order => dispatch(actionCreators.updateBook(order)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Book);
