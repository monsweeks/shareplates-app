import React from 'react';
import PropTypes from 'prop-types';
import './SubLabel.scss';

class SubLabel extends React.PureComponent {
  render() {
    const { children, className, icon, outline, size, bold } = this.props;
    return (
      <div className={`sub-label-wrapper ${className} ${outline ? 'outline' : ''} ${size} ${bold ? 'bold' : ''}`}>
        <span>
          {icon && (
            <span className="icon">
              <i className="fal fa-chevron-circle-right"/>
            </span>
          )}
          <span className="text">{children}</span>
        </span>
      </div>
    );
  }
}

export default SubLabel;

SubLabel.defaultProps = {
  className: '',
  icon: false,
  outline: false,
  size: 'md',
  bold: false,
};

SubLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.bool,
  outline: PropTypes.bool,
  size: PropTypes.string,
  bold: PropTypes.bool,
};
