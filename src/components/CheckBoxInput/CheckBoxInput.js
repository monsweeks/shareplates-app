import React from 'react';
import PropTypes from 'prop-types';
import './CheckBoxInput.scss';

class CheckBoxInput extends React.PureComponent {
  render() {
    const { className, label, onChange, value, size } = this.props;

    return (
      <div
        className={`check-box-input-wrapper ${size} ${className}`}
        onClick={() => {
          onChange(!value);
        }}
      >
        <span className={`check-box-span ${value ? 'checked' : ''}`}>
          <span />
        </span>
        <label className="g-no-select">{label}</label>
      </div>
    );
  }
}

CheckBoxInput.defaultProps = {
  className: '',
  label: '',
  onChange: null,
  value: false,
  size : 'md',
};

CheckBoxInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.bool,
  size : PropTypes.string,
};

export default CheckBoxInput;
