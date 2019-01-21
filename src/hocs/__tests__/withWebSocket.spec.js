import React from 'react';
import { shallow } from 'enzyme';

import withWebSocket from '../withWebSocket';

describe('withWebSocket()', () => {
  it('enhances input component correctly', () => {
    const cmp = () => <div />;
    const Enhanced = withWebSocket(cmp);
    expect(shallow(<Enhanced />)).toMatchSnapshot();
  });
});
