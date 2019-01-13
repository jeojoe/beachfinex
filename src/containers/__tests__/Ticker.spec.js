import React from 'react';
import { shallow } from 'enzyme';

import { Ticker } from '../Ticker';

describe('<Ticker />', () => {
  it('renders correctly', () => {
    const setTicker = jest.fn();
    const wrapped = shallow(
      <Ticker
        dailyChange={1}
        dailyChangePerc={2}
        lastPrice={3}
        volume={4}
        high={5}
        low={6}
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
