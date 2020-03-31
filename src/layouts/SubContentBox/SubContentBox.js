import React from 'react';
import PropTypes from 'prop-types';
import './SubContentBox.scss';

class SubContentBox extends React.PureComponent {
  render() {
    const { className, children, arrow } = this.props;
    return (
      <div className={`sub-content-box-wrapper ${className}`}>
        {arrow && <div className="arrow" />}
        {children}
      </div>
    );
  }
}

export default SubContentBox;

SubContentBox.defaultProps = {
  className: '',
  arrow : true,
};

SubContentBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  arrow : PropTypes.bool,
};
