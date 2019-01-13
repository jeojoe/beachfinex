import React from 'react';
import { shallow } from 'enzyme';

import { Ticker } from '../Ticker';

describe('<Ticker />', () => {
  it('renders correctly', () => {
    const setTicker = jest.fn();
    const ticker = {
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
    };
    const wrapped = shallow(
      <Ticker
        ticker={ticker}
        setTicker={setTicker}
        ws={{
          subscribed: false,
          subscribing: true,
          subscribeSuccess: jest.fn(),
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
