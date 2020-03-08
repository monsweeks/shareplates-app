import React from 'react';
import PropTypes from 'prop-types';
import './EmptyMessage.scss';

class EmptyMessage extends React.PureComponent {
  render() {
    const { className, message } = this.props;
    return (
      <div className={`empty-message-wrapper ${className}`}>
        <div>{message}</div>
      </div>
    );
  }
}

export default EmptyMessage;

EmptyMessage.defaultProps = {
  className: '',
  message: null,
};

EmptyMessage.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
};
