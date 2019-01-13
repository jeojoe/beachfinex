import React from 'react';
import { shallow } from 'enzyme';
import { List } from 'immutable';

import { Trades } from '../Trades';

describe('<Trades />', () => {
  it('renders correctly', () => {
    const initTrades = jest.fn();
    const updateTrades = jest.fn();
    const trades = List([
      [3, 1547282908000, -1, 1],
      [2, 1547282907000, 1, 1],
    ]);
    const wrapped = shallow(
      <Trades
        initTrades={initTrades}
        bids={trades}
        updateTrades={updateTrades}
        ws={{
          subscribed: false,
          subscribing: true,
          setSubscribed: jest.fn(),
          subscribe: jest.fn(),
          unsubscribe: jest.fn(),
          toggle: jest.fn(),
          setMoreActions: jest.fn(),
        }}
      />,
    );
    expect(wrapped).toMatchSnapshot();
  });
});
