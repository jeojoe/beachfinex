import { List } from 'immutable';
import trades, {
  INIT_TRADES,
  UPDATE_TRADES,
  actionCreators,
} from '../trades';

describe('Trades action types', () => {
  it('has correct INIT_TRADES type', () => {
    expect(INIT_TRADES).toBe('INIT_TRADES');
  });

  it('has correct UPDATE_TRADES type', () => {
    expect(UPDATE_TRADES).toBe('UPDATE_TRADES');
  });
});

describe('Trades action creators', () => {
  it('creates correct initTrades action', () => {
    const created = actionCreators.initTrades('test');
    expect(created).toEqual({
      type: 'INIT_TRADES',
      trades: 'test',
    });
  });

  it('creates correct updateTrades action', () => {
    const created = actionCreators.updateTrades('test');
    expect(created).toEqual({
      type: 'UPDATE_TRADES',
      trade: 'test',
    });
  });
});

describe('Trades reducer', () => {
  it('handles initial state correctly', () => {
    const reduced = trades(undefined, {});
    expect(reduced).toBe(null);
  });

  it('reduces INIT_TRADES action correctly', () => {
    const action = {
      type: 'INIT_TRADES',
      trades: [
        [3, 1547282908000, -1, 1],
        [2, 1547282907000, 1, 1],
        [1, 1547282906000, -1, 1],
      ],
    };
    const reduced = trades(undefined, action);
    expect(reduced).toEqual(List([
      [3, 1547282908000, -1, 1],
      [2, 1547282907000, 1, 1],
      [1, 1547282906000, -1, 1],
    ]));
  });

  it('reduces UPDATE_TRADES action correctly', () => {
    const state = List([
      [3, 1547282908000, -1, 1],
    ]);
    const action = {
      type: 'UPDATE_TRADES',
      trade: 'pushed',
    };
    const reduced = trades(state, action);
    expect(reduced.get(0)).toBe('pushed');
    expect(reduced.get(1)).toEqual([3, 1547282908000, -1, 1]);
    expect(reduced.size).toBe(30);
  });
});
