import React from 'react';
import './Description.scss';
import PropTypes from 'prop-types';

class Description extends React.PureComponent {
  render() {
    const { children, className } = this.props;
    return (
      <div className={`description-wrapper ${className}`}>
        <span>{children}</span>
      </div>
    );
  }
}

export default Description;

Description.defaultProps = {
  className: '',
};

Description.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
