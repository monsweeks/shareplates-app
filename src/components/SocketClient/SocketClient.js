import React from 'react';
import PropTypes from 'prop-types';
import SockJsClient from 'react-stomp';

class SocketClient extends React.PureComponent {
  render() {
    const local = ['localhost', '127.0.0.1', '192.168.39.3'].some((d) => d === window.location.hostname);
    // eslint-disable-next-line no-nested-ternary
    const base = local
      ? window.location.hostname === '192.168.39.3'
        ? 'http://192.168.39.3:8080'
        : 'http://localhost:8080'
      : '';
    const { topics } = this.props;
    const { headers } = this.props;
    const { onConnect, onMessage, onDisconnect } = this.props;

    return (
      <SockJsClient
        url={`${base}/ws-stomp`}
        topics={topics}
        headers={headers}
        onMessage={onMessage}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        ref={(client) => {
          this.clientRef = client;
        }}
      />
    );
  }
}
export default SocketClient;

SocketClient.defaultProps = {};

SocketClient.propTypes = {
  onMessage: PropTypes.func,
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
  topics: PropTypes.arrayOf(PropTypes.string),
  headers: PropTypes.objectOf(PropTypes.any),
};
