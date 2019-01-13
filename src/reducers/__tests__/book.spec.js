import { Map, OrderedMap } from 'immutable';

import book, {
  INIT_BOOK,
  UPDATE_BOOK,
  ZOOM_IN,
  ZOOM_OUT,
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

  it('has correct ZOOM_IN type', () => {
    expect(ZOOM_IN).toBe('ZOOM_IN');
  });

  it('has correct ZOOM_OUT type', () => {
    expect(ZOOM_OUT).toBe('ZOOM_OUT');
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

  it('creates correct zoomIn action', () => {
    const created = actionCreators.zoomIn();
    expect(created).toEqual({
      type: 'ZOOM_IN',
    });
  });

  it('creates correct zoomOut action', () => {
    const created = actionCreators.zoomOut();
    expect(created).toEqual({
      type: 'ZOOM_OUT',
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
      zoom: 1,
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
      zoom: 1,
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

  it('reduces ZOOM_IN action correctly', () => {
    const action = { type: 'ZOOM_IN' };
    const reduced = book(undefined, action);
    expect(reduced).toEqual({
      bids: null,
      bidsTotal: 0,
      asks: null,
      asksTotal: 0,
      zoom: 1.1,
    });
    // Edge case
    const state = { zoom: 3 };
    const reducedEdge = book(state, action);
    expect(reducedEdge).toEqual({ zoom: 3 });
  });

  it('reduces ZOOM_OUT action correctly', () => {
    const action = { type: 'ZOOM_OUT' };
    const reduced = book(undefined, action);
    expect(reduced).toEqual({
      bids: null,
      bidsTotal: 0,
      asks: null,
      asksTotal: 0,
      zoom: 0.9,
    });
    // Edge case
    const state = { zoom: 0.3 };
    const reducedEdge = book(state, action);
    expect(reducedEdge).toEqual({ zoom: 0.3 });
  });
});
