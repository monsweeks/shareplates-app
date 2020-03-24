import React from 'react';
import './SubLabel.scss';
import PropTypes from 'prop-types';

class SubLabel extends React.PureComponent {
  render() {
    const { children, className, icon } = this.props;
    return (
      <div className={`sub-label-wrapper ${className}`}>
        <span>
          {icon && (
            <span className="icon">
              <i className="fal fa-info-circle" />
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
};

SubLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.bool,
};
