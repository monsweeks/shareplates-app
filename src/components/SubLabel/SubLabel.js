import React from 'react';
import './SubLabel.scss';
import PropTypes from 'prop-types';

class SubLabel extends React.PureComponent {
  render() {
    const { children, className } = this.props;
    return (
      <div className={`sub-label-wrapper ${className}`}>
        <span>{children}</span>
      </div>
    );
  }
}

export default SubLabel;

SubLabel.defaultProps = {
  className: '',
};

SubLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
