// Action types

export const SET_TICKER = 'SET_TICKER';

// Action creators

function setTicker(rawTicker) {
  return {
    type: SET_TICKER,
    rawTicker,
  };
}

export const actionCreators = {
  setTicker,
};

// Reducer

const initialState = {
  bid: 0,
  bidSize: 0,
  ask: 0,
  askSize: 0,
  dailyChange: 0,
  dailyChangePerc: 0,
  lastPrice: 0,
  volume: 0,
  high: 0,
  low: 0,
};

const ticker = (state = initialState, action) => {
  switch (action.type) {
    case SET_TICKER: {
      const { rawTicker } = action;
      return {
        bid: rawTicker[0],
        bidSize: rawTicker[1],
        ask: rawTicker[2],
        askSize: rawTicker[3],
        dailyChange: rawTicker[4],
        dailyChangePerc: rawTicker[5],
        lastPrice: rawTicker[6],
        volume: rawTicker[7],
        high: rawTicker[8],
        low: rawTicker[9],
      };
    }
    default: {
      return state;
    }
  }
};

export default ticker;
