import React from 'react';
import PropTypes from 'prop-types';
import './CircleIcon.scss';

class CircleIcon extends React.PureComponent {
  render() {
    const { onClick, className, icon, size, color } = this.props;
    return (
      <span className={`${className} circle-icon-wrapper ${color} ${size}`} onClick={onClick}>
        {icon}
      </span>
    );
  }
}

export default CircleIcon;

CircleIcon.defaultProps = {
  className: '',
  icon: <i className="fal fa-info" />,
  size: 'md',
};

CircleIcon.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  icon: PropTypes.node,
  size: PropTypes.string,
  color: PropTypes.string,
};
