import { List } from 'immutable';

// Action types

export const INIT_TRADES = 'INIT_TRADES';

// Action creators

function initTrades(trades) {
  return {
    type: INIT_TRADES,
    trades,
  };
}

export const actionCreators = {
  initTrades,
};

// Reducer

const initialState = null;

const trades = (state = initialState, action) => {
  switch (action.type) {
    case INIT_TRADES: {
      return List(action.trades);
    }
    default: {
      return state;
    }
  }
};

export default trades;
