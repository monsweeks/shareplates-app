import React from 'react';
import PropTypes from 'prop-types';
import './ButtonControl.scss';

class ButtonControl extends React.PureComponent {
  render() {
    const { className, onClick, children, icon } = this.props;

    return (
      <div className={`button-control-wrapper ${className} ${icon ? 'icon' : ''}`} onClick={onClick}>
        <div>{children}</div>
      </div>
    );
  }
}

ButtonControl.defaultProps = {
  className: '',
};

ButtonControl.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  icon: PropTypes.bool,
};

export default ButtonControl;
