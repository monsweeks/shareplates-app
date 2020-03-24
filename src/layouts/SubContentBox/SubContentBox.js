import React from 'react';
import PropTypes from 'prop-types';
import './SubContentBox.scss';

class SubContentBox extends React.PureComponent {
  render() {
    const { className, children } = this.props;
    return (
      <div className={`sub-content-box-wrapper ${className}`}>
        <div className="arrow" />
        {children}
      </div>
    );
  }
}

export default SubContentBox;

SubContentBox.defaultProps = {
  className: '',
};

SubContentBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
