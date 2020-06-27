import React from 'react';
import PropTypes from 'prop-types';
import './Pill.scss';

class Pill extends React.PureComponent {
  render() {
    const { className, labelClassName, label, value } = this.props;

    return (
      <div className={`pill-wrapper ${className}`}>
        <span className={labelClassName}>{label}</span>
        <span>{value}</span>
      </div>
    );
  }
}

Pill.defaultProps = {
  className: '',
  labelClassName: '',
};

Pill.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Pill;
