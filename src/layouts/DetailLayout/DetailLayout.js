import React from 'react';
import './DetailLayout.scss';
import PropTypes from 'prop-types';

class DetailLayout extends React.PureComponent {
  render() {
    const { children, className, fill, margin } = this.props;
    return <div className={`detail-layout-wrapper container ${className} ${fill ? 'fill' : ''}`}><div className={margin ? 'p-4' : ''}>{children}</div></div>;
  }
}

export default DetailLayout;

DetailLayout.defaultProps = {
  className: '',
  fill : false,
  margin : true,
};

DetailLayout.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  fill : PropTypes.bool,
  margin : PropTypes.bool,
};
