import React from 'react';
import './DetailLayout.scss';
import PropTypes from 'prop-types';

class DetailLayout extends React.PureComponent {
  render() {
    const { children, className, fill } = this.props;
    return (
      <div className={`detail-layout-wrapper container ${className} ${fill ? 'fill' : ''}`}>
        <div>{children}</div>
      </div>
    );
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
