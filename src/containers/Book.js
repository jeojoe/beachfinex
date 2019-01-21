import React from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import BigNumber from 'bignumber.js';

import { actionCreators } from '../reducers/book';
import HeaderRow from '../components/HeaderRow';
import BookRow from '../components/BookRow';
import BookAction from '../components/BookAction';
import ControlRow from '../components/ControlRow';
import WSAction from '../components/WSAction';
import withWebSocket, { propTypesWS } from '../hocs/withWebSocket';

const getOpenMsg = precision => ({
  event: 'subscribe',
  channel: 'book',
  symbol: 'tBTCUSD',
  prec: precision,
});

export class Book extends React.Component {
  lastRendered = Date.now();

  componentDidMount() {
    const { ws } = this.props;
    ws.subscribe({
      newOpenMsg: getOpenMsg('P0'),
      newOnMessage: this.onMessage,
    });
  }

  shouldComponentUpdate(nextProps) {
    const { precision, zoom, ws } = this.props;
    if (precision !== nextProps.precision) return true;
    if (zoom !== nextProps.zoom) return true;
    if (ws.subscribed !== nextProps.ws.subscribed) return true;
    if (ws.subscribing !== nextProps.ws.subscribing) return true;
    const now = Date.now();
    const timeOk = now - this.lastRendered > 250;
    const bookFull = nextProps.bids && nextProps.bids.size === 25 && nextProps.asks.size === 25;
    if (bookFull && timeOk) {
      this.lastRendered = now;
      return true;
    }
    return false;
  }

  onMessage = (msg) => {
    const { initBook, updateBook, ws } = this.props;
    const parsed = JSON.parse(msg.data);
    if (parsed.event === 'subscribed') {
      ws.subscribeSuccess();
      return;
    }
    const data = parsed[1];
    const valid = data && data !== 'hb';
    if (valid) {
      const init = Array.isArray(data[0]);
      if (init) initBook(data);
      else updateBook(data);
    }
  }

  changePrecision = (prec) => {
    const { ws, precision: prevPrec, setPrecision } = this.props;
    if (prec !== prevPrec) {
      if (ws.subscribed) ws.unsubscribe();
      ws.subscribe({ newOpenMsg: getOpenMsg(prec) });
      // Save precision
      setPrecision(prec);
    }
  }

  renderRow(side) {
    const { total, zoom } = this.props;
    const book = this.props[side]; // eslint-disable-line

    if (!book) return 'Fetching..';

    let acc = new BigNumber(0);
    return book.toArray().map(([, order]) => {
      const [price, count, amount] = order;
      acc = acc.plus(amount);
      const percent = acc.abs().dividedBy(total)
        .times(100)
        .times(zoom)
        .toFixed(0);
      return (
        <BookRow
          key={`${price}${amount}`}
          side={side}
          price={price}
          total={acc}
          amount={amount}
          count={count}
          percent={percent}
        />
      );
    });
  }

  renderControl() {
    const { ws, precision } = this.props;
    return (
      <ControlRow>
        <WSAction
          subscribed={ws.subscribed}
          subscribing={ws.subscribing}
          toggle={ws.toggle}
        />
        <BookAction
          precision={precision}
          changePrecision={this.changePrecision}
        />
      </ControlRow>
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
        {this.renderControl()}
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
  ws: PropTypes.shape(propTypesWS).isRequired,
  zoom: PropTypes.number.isRequired,
  precision: PropTypes.oneOf(
    ['P0', 'P1', 'P2', 'P3'],
  ).isRequired,
  setPrecision: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    bids: state.book.bids,
    asks: state.book.asks,
    precision: state.book.precision,
    zoom: state.book.zoom,
    total: (new BigNumber(state.book.asksTotal))
      .abs()
      .plus(state.book.bidsTotal),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initBook: orders => dispatch(actionCreators.initBook(orders)),
    updateBook: order => dispatch(actionCreators.updateBook(order)),
    setPrecision: prec => dispatch(actionCreators.setPrecision(prec)),
  };
}

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withWebSocket,
);

export default enhance(Book);
