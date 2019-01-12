import React from 'react';
import { shallow } from 'enzyme';
import BigNumber from 'bignumber.js';
import { Map } from 'immutable';

import { Book } from '../Book';

describe('<Book />', () => {
  it('renders correctly', () => {
    const initBook = jest.fn();
    const updateBook = jest.fn();
    const bids = Map([
      [1, [1, 1, 1]],
      [2, [2, 1, 1]],
    ]);
    const asks = Map([
      [1, [1, 1, -1]],
      [2, [2, 1, -1]],
    ]);
    const wrapped = shallow(
      <Book
        initBook={initBook}
        bids={bids}
        asks={asks}
        updateBook={updateBook}
        total={new BigNumber(4)}
      />,
    );
    expect(wrapped).toMatchSnapshot();
  });
});
