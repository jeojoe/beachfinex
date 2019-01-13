import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import BigNumber from 'bignumber.js';

import { actionCreators } from '../reducers/book';
import HeaderRow from '../components/HeaderRow';
import BookRow from '../components/BookRow';
import withWebSocket, { propTypesWS } from '../hocs/withWebSocket';

const precisions = ['P0', 'P1', 'P2', 'P3'];
const getOpenMsg = precision => ({
  event: 'subscribe',
  channel: 'book',
  symbol: 'tBTCUSD',
  prec: precision,
});

export class Book extends React.Component {
  state = {
    zoom: 1,
  };

  componentDidMount() {
    const { ws } = this.props;
    ws.subscribe({
      newOpenMsg: getOpenMsg('P0'),
      newOnMessage: this.onMessage,
      newActionRow: this.getActionRow('P0'),
    });
  }

  onMessage = (msg) => {
    const { initBook, updateBook, ws } = this.props;
    const parsed = JSON.parse(msg.data);
    if (parsed.event === 'subscribed') {
      ws.setSubscribed();
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

  changePrecision = (precision) => {
    const { precision: current } = this.state;
    const { ws } = this.props;
    if (precision !== current) {
      if (ws.subscribed) ws.unsubscribe();
      ws.subscribe({
        newOpenMsg: getOpenMsg(precision),
        newActionRow: this.getActionRow(precision),
      });
    }
  }

  zoomIn = () => this.setState(prev => ({
    zoom: prev.zoom < 3 ? prev.zoom + 0.1 : prev.zoom,
  }))

  zoomOut = () => this.setState(prev => ({
    zoom: prev.zoom > 0.3 ? prev.zoom - 0.1 : prev.zoom,
  }))

  getActionRow = precision => (
    <>
      <div>
        {precisions.map(prec => (
          <button
            onClick={() => this.changePrecision(prec)}
            type="button"
            key={prec}
          >
            {prec}
          </button>
        ))}
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
    </>
  )

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

  render() {
    return (
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

export default withWebSocket(connect(mapStateToProps, mapDispatchToProps)(Book));
