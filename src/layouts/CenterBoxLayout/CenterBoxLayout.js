import React from 'react';
import PropTypes from 'prop-types';
import './CenterBoxLayout.scss';

class CenterBoxLayout extends React.PureComponent {
  render() {
    const { children, className } = this.props;
    return <div className={`center-box-layout container align-self-center ${className}`}>{children}</div>;
  }
}

export default CenterBoxLayout;

CenterBoxLayout.defaultProps = {
  className: '',
};

CenterBoxLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
