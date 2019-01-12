import { Map } from 'immutable';

// Action types

export const INIT_BOOK = 'INIT_BOOK';
export const UPDATE_BOOK = 'UPDATE_BOOK';

// Action creators

function initBook(orders) {
  return {
    type: INIT_BOOK,
    orders,
  };
}
function updateBook(order) {
  return {
    type: UPDATE_BOOK,
    order,
  };
}

export const actionCreators = {
  initBook,
  updateBook,
};

// Helpers

export function toIterable(order) {
  return [order[0], order];
}

export function sortBook(side, book) {
  return book.sort(
    ([priceA], [priceB]) => (
      side === 'bids' ? priceB - priceA : priceA - priceB
    ),
  );
}

export function sumBook(book) {
  return book.reduce((acc, order) => acc + order[2], 0);
}

// Reducer

const initialState = {
  bids: null,
  bidsTotal: 0,
  asks: null,
  asksTotal: 0,
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
        bidsTotal: sumBook(sortedBids),
        asks: sortedAsks,
        asksTotal: sumBook(sortedAsks),
      };
    }
    case UPDATE_BOOK: {
      const [price, count, amount] = action.order;
      const side = amount >= 0 ? 'bids' : 'asks';
      const updatedBook = count === 0
        ? state[side].delete(price)
        : state[side].set(price, action.order);
      return {
        ...state,
        [side]: sortBook(side, updatedBook),
        [`${side}Total`]: sumBook(updatedBook),
      };
    }
    default: {
      return state;
    }
  }
};

export default book;
