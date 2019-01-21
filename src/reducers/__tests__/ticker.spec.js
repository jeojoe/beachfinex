import ticker, {
  SET_TICKER,
  actionCreators,
} from '../ticker';

describe('Ticker action types', () => {
  it('has correct SET_TICKER type', () => {
    expect(SET_TICKER).toBe('SET_TICKER');
  });
});

describe('Ticker action creators', () => {
  it('creates correct setTicker action', () => {
    const created = actionCreators.setTicker('test');
    expect(created).toEqual({
      type: 'SET_TICKER',
      rawTicker: 'test',
    });
  });
});

describe('Ticker action reducer', () => {
  it('handles initial state correctly', () => {
    const reduced = ticker(undefined, {});
    expect(reduced).toEqual({
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
    });
  });

  it('reduces SET_TICKER action correctly', () => {
    const action = {
      type: 'SET_TICKER',
      rawTicker: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      ],
    };
    const reduced = ticker(undefined, action);
    expect(reduced).toEqual({
      bid: 0,
      bidSize: 1,
      ask: 2,
      askSize: 3,
      dailyChange: 4,
      dailyChangePerc: 5,
      lastPrice: 6,
      volume: 7,
      high: 8,
      low: 9,
    });
  });
});
