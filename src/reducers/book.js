import { Map } from 'immutable';

// Action types

export const INIT_BOOK = 'INIT_BOOK';

// Action creators

function initBook(orders) {
  return {
    type: INIT_BOOK,
    orders,
  };
}

export const actionCreators = {
  initBook,
};

// Reducer

function toIterable(order) {
  return [order[0], order];
}

function sortBook(side, book) {
  return book.sort(
    ([priceA], [priceB]) => (
      side === 'bids' ? priceB - priceA : priceA - priceB
    ),
  );
}

const initialState = {
  bids: null,
  asks: null,
};

const book = (state = initialState, action) => {
  switch (action.type) {
    case INIT_BOOK: {
      const len = action.orders.length / 2;
      const rawBids = action.orders.slice(0, len);
      const rawAsks = action.orders.slice(len);
      const iterableBids = rawBids.map(toIterable);
      const iterableAsks = rawAsks.map(toIterable);
      const sortedBids = sortBook('bids', Map(iterableBids));
      const sortedAsks = sortBook('asks', Map(iterableAsks));
      return {
        bids: sortedBids,
        asks: sortedAsks,
      };
    }
    default: {
      return state;
    }
  }
};

export default book;
