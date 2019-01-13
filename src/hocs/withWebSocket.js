import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
      // New settings
      if (newOpenMsg) this.openMsg = newOpenMsg;
      if (newOnMessage) this.onMessage = newOnMessage;
      if (newActionRow) this.setState({ actions: newActionRow });
      // New WS instance
      this.ws = new WebSocket('wss://api.bitfinex.com/ws/2');
      this.ws.onopen = this.onOpen;
      this.ws.onmessage = this.onMessage;
      this.ws.onerror = this.onError;
      this.setState({ subscribing: true });
    }

    onOpen = () => this.ws.send(JSON.stringify(this.openMsg));

    onError = err => this.unsubscribe(err);

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

    toggle = () => {
      if (this.ws) {
        this.unsubscribe();
      } else {
        this.subscribe();
      }
    }

    setSubscribed = () => this.setState({
      subscribed: true,
      subscribing: false,
    });

    renderActions() {
      const { subscribed, subscribing, actions } = this.state;
      return (
        <ActionRow>
          <div>
            <b>{subscribed ? 'REAL-TIME' : 'OFFLINE' }</b>
            {' '}
            {subscribing
              ? '(Subscribing..)'
              : (
                <button onClick={this.toggle} type="button">
                  {subscribed ? 'Unsubscribe' : 'Subscribe'}
                </button>
              )
            }
          </div>
          {actions}
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
              setSubscribed: this.setSubscribed,
              subscribe: this.subscribe,
              unsubscribe: this.unsubscribe,
              toggle: this.toggle,
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
  setSubscribed: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default withWebSocket;
