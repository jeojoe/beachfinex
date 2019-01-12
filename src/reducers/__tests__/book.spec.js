import { Map, OrderedMap } from 'immutable';

import book, {
  INIT_BOOK,
  UPDATE_BOOK,
  actionCreators,
  toIterable,
  sortBook,
  sumBook,
} from '../book';

describe('Book action types', () => {
  it('has correct INIT_BOOK type', () => {
    expect(INIT_BOOK).toBe('INIT_BOOK');
  });

  it('has correct UPDATE_BOOK type', () => {
    expect(UPDATE_BOOK).toBe('UPDATE_BOOK');
  });
});

describe('Book action creators', () => {
  it('creates correct initBook action', () => {
    const created = actionCreators.initBook('test');
    expect(created).toEqual({
      type: 'INIT_BOOK',
      orders: 'test',
    });
  });

  it('creates correct updateBook action', () => {
    const created = actionCreators.updateBook('test');
    expect(created).toEqual({
      type: 'UPDATE_BOOK',
      order: 'test',
    });
  });
});

describe('Book helpers', () => {
  describe('toIterable()', () => {
    it('transforms order to iterable correctly', () => {
      const transformed = toIterable([3698.6, 2, 3.392692]);
      const expected = [3698.6, [3698.6, 2, 3.392692]];
      expect(transformed).toEqual(expected);
    });
  });

  describe('sortBook()', () => {
    const mockBook = Map([[1, [1, 1, 1]], [2, [2, 2, 2]]]);
    it('sorts bids book correctly', () => {
      const sorted = sortBook('bids', mockBook);
      const expected = OrderedMap([[2, [2, 2, 2]], [1, [1, 1, 1]]]);
      expect(sorted).toEqual(expected);
    });

    it('sorts asks book correctly', () => {
      const sorted = sortBook('asks', mockBook);
      const expected = OrderedMap([[1, [1, 1, 1]], [2, [2, 2, 2]]]);
      expect(sorted).toEqual(expected);
    });
  });

  describe('sumBook()', () => {
    it('sums every amount of book correctly', () => {
      const mockBook = Map([[1, [1, 1, 0.1]], [2, [2, 2, 10]]]);
      const summed = sumBook(mockBook);
      expect(summed).toBe(10.1);
    });
  });
});

describe('Book reducer', () => {
  it('reduces initial state correctly', () => {
    const reduced = book(undefined, {});
    expect(reduced).toEqual({
      bids: null,
      bidsTotal: 0,
      asks: null,
      asksTotal: 0,
    });
  });

  it('reduces INIT_BOOK action correctly', () => {
    const action = {
      type: 'INIT_BOOK',
      orders: [
        [1, 1, 1],
        [2, 1, 1],
        [3, 1, -1],
        [4, 1, -1],
      ],
    };
    const reduced = book(undefined, action);
    expect(reduced).toEqual({
      bids: OrderedMap([
        [2, [2, 1, 1]],
        [1, [1, 1, 1]],
      ]),
      bidsTotal: 2,
      asks: OrderedMap([
        [3, [3, 1, -1]],
        [4, [4, 1, -1]],
      ]),
      asksTotal: -2,
    });
  });

  it('reduces UPDATE_BOOK action correctly', () => {
    const state = {
      bids: OrderedMap([
        [2, [2, 1, 1]],
        [1, [1, 1, 1]],
      ]),
      bidsTotal: 2,
      asks: OrderedMap([
        [3, [3, 1, -1]],
        [4, [4, 1, -1]],
      ]),
      asksTotal: -2,
    };
    const action = {
      type: 'UPDATE_BOOK',
      order: [3, 2, -2],
    };
    const reduced = book(state, action);
    expect(reduced).toEqual({
      bids: OrderedMap([
        [2, [2, 1, 1]],
        [1, [1, 1, 1]],
      ]),
      bidsTotal: 2,
      asks: OrderedMap([
        [3, [3, 2, -2]],
        [4, [4, 1, -1]],
      ]),
      asksTotal: -3,
    });
  });
});
