import React from 'react';
import PropTypes from 'prop-types';
import './RegisterLayout.scss';

class RegisterLayout extends React.PureComponent {
  render() {
    const { children, className, fill } = this.props;
    return <div className={`register-layout-wrapper container ${className} ${fill ? 'fill' : ''}`}>{children}</div>;
  }
}

export default RegisterLayout;

RegisterLayout.defaultProps = {
  className: '',
  fill: false,
};

RegisterLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  fill: PropTypes.bool,
};
