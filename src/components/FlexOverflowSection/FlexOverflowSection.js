import React from 'react';
import PropTypes from 'prop-types';
import './FlexOverflowSection.scss';

class FlexOverflowSection extends React.PureComponent {
  render() {
    const { className, children, overflowX } = this.props;

    return (
      <div className={`flex-overflow-section-wrapper ${className}`}>
        <div>
          <div className={`${overflowX ? 'overflow-x scrollbar' : ''}`}>{children}</div>
        </div>
      </div>
    );
  }
}

FlexOverflowSection.defaultProps = {
  className: '',
  overflowX: false,
};

FlexOverflowSection.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  overflowX: PropTypes.bool,
};

export default FlexOverflowSection;
