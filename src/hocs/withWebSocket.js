import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import WSAction from '../components/WSAction';

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0 0;
`;

function withWebSocket(Component) {
  return class WithWebSocket extends React.Component {
    state = {
      subscribed: false,
      subscribing: true,
      actionRow: null,
    }

    subscribe = ({ newOpenMsg, newOnMessage, newActionRow } = {}) => {
      if (newOpenMsg) this.openMsg = newOpenMsg;
      if (newOnMessage) this.onMessage = newOnMessage;
      if (newActionRow) this.setState({ actionRow: newActionRow });
      this.ws = new WebSocket('wss://api.bitfinex.com/ws/2');
      this.ws.onopen = this.onOpen;
      this.ws.onmessage = this.onMessage;
      this.ws.onerror = this.onError;
      this.setState({ subscribing: true });
    }

    unsubscribe = (err) => {
      this.ws.close();
      this.ws = null;
      this.setState({ subscribed: false });
      if (err) {
        // Has error, not user's action => subscribe again
        console.error(err);
        this.subscribe();
      }
    }

    toggle = () => (this.ws ? this.unsubscribe() : this.subscribe())

    onOpen = () => this.ws.send(JSON.stringify(this.openMsg));

    onError = err => this.unsubscribe(err);

    subscribeSuccess = () => this.setState({
      subscribed: true,
      subscribing: false,
    });

    renderActions() {
      const { subscribed, subscribing, actionRow } = this.state;
      return (
        <ActionRow>
          <WSAction
            subscribed={subscribed}
            subscribing={subscribing}
            toggle={this.toggle}
          />
          {actionRow}
        </ActionRow>
      );
    }

    render() {
      const { subscribed, subscribing } = this.state;

      return (
        <div>
          <Component
            {...this.props}
            ws={{
              subscribed,
              subscribing,
              subscribeSuccess: this.subscribeSuccess,
              subscribe: this.subscribe,
              unsubscribe: this.unsubscribe,
            }}
          />
          {this.renderActions()}
        </div>
      );
    }
  };
}

export const propTypesWS = {
  subscribed: PropTypes.bool.isRequired,
  subscribing: PropTypes.bool.isRequired,
  subscribeSuccess: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
};

export default withWebSocket;
