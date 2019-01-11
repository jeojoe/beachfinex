import { List } from 'immutable';

// Action types

export const INIT_TRADES = 'INIT_TRADES';
export const UPDATE_TRADES = 'UPDATE_TRADES';

// Action creators

function initTrades(trades) {
  return {
    type: INIT_TRADES,
    trades,
  };
}
function updateTrades(trade) {
  return {
    type: UPDATE_TRADES,
    trade,
  };
}

export const actionCreators = {
  initTrades,
  updateTrades,
};

// Reducer

const initialState = null;

const trades = (state = initialState, action) => {
  switch (action.type) {
    case INIT_TRADES: {
      return List(action.trades);
    }
    case UPDATE_TRADES: {
      return state.unshift(action.trade).setSize(30);
    }
    default: {
      return state;
    }
  }
};

export default trades;
