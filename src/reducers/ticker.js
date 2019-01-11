// Action types

export const SET_TICKER = 'SET_TICKER';

// Reducer

const initialState = 'ticker';

const ticker = (state = initialState, action) => {
  switch (action.type) {
    case SET_TICKER: {
      return action.ticker;
    }
    default: {
      return state;
    }
  }
};

export default ticker;
