import React from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import HeaderRow from './HeaderRow';

function getBookRowBg(side, percent) {
  const direction = side === 'bids' ? 'left' : 'right';
  const color = side === 'bids' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)';
  return `linear-gradient(
    to ${direction},
    ${color} ${percent}%,
    transparent 0%
  )`;
}

const Row = styled(HeaderRow)`
  background: ${props => getBookRowBg(props.side, props.percent)};
  & p {
    color: ${props => (props.side === 'bids' ? 'lime' : 'red')};
    font-size: 14px;
  }
`;

const BookRow = ({
  side, order, acc, percent,
}) => {
  const [price, count, amount] = order;
  const countStr = count.toFixed(0);
  const amountStr = Math.abs(amount).toFixed(2);
  const totalStr = acc.abs().toFixed(2);
  const priceStr = new BigNumber(price).toFixed(2);

  return (
    <Row
      key={price}
      side={side}
      percent={percent}
    >
      {side === 'bids'
        ? (
          <>
            <p className="count">{countStr}</p>
            <p>{amountStr}</p>
            <p>{totalStr}</p>
            <p className="price">{priceStr}</p>
          </>
        ) : (
          <>
            <p className="price">{priceStr}</p>
            <p>{totalStr}</p>
            <p>{amountStr}</p>
            <p className="count">{countStr}</p>
          </>
        )
      }
    </Row>
  );
};

BookRow.propTypes = {
  side: PropTypes.string.isRequired,
  order: PropTypes.array.isRequired,
  acc: PropTypes.instanceOf(BigNumber).isRequired,
  percent: PropTypes.string.isRequired,
};

export default BookRow;
