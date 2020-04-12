import React from 'react';
import PropTypes from 'prop-types';
import './CheckControl.scss';

class CheckControl extends React.PureComponent {
  render() {
    const { className, optionKey, optionValue, active, value, onClick, children } = this.props;

    return (
      <li
        className={`icon-control-wrapper ${className} ${active ? 'active' : 'in-active'} ${
          optionValue === value ? 'selected' : ''
        }`}
        onClick={() => {
          if (active) {
            onClick(optionKey, optionValue);
          }
        }}
      >
        <div>{children}</div>
      </li>
    );
  }
}

CheckControl.defaultProps = {
  className: '',
};

CheckControl.propTypes = {
  className: PropTypes.string,
  optionKey: PropTypes.string,
  optionValue: PropTypes.string,
  active: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
  children : PropTypes.node,
};

export default CheckControl;
