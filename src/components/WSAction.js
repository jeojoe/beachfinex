import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Status = styled.b`
  color: ${props => (props.subscribed ? 'lime' : '#fff')}
`;

const WSAction = ({ subscribed, subscribing, toggle }) => (
  <div>
    <Status subscribed={subscribed}>
      {subscribed ? 'REAL-TIME' : 'OFFLINE' }
    </Status>
    {' '}
    {subscribing
      ? '(Subscribing..)'
      : (
        <button
          onClick={toggle}
          type="button"
        >
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      )
    }
  </div>
);

WSAction.propTypes = {
  subscribed: PropTypes.bool.isRequired,
  subscribing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default WSAction;
