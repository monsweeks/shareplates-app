import React from 'react';
import PropTypes from 'prop-types';
import './DetailLayout.scss';

class DetailLayout extends React.PureComponent {
  render() {
    const { children, className, fill } = this.props;
    return <div className={`detail-layout-wrapper ${className} ${fill ? 'fill' : ''}`}>{children}</div>;
  }
}

export default DetailLayout;

DetailLayout.defaultProps = {
  className: '',
  fill: false,
};

DetailLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  fill: PropTypes.bool,
};
