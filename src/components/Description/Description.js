import React from 'react';
import PropTypes from 'prop-types';
import './Description.scss';

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
