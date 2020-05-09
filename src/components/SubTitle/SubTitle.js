import React from 'react';
import PropTypes from 'prop-types';
import './SubTitle.scss';

class SubTitle extends React.PureComponent {
  render() {
    const { children, className } = this.props;
    return (
      <div className={`sub-title-wrapper ${className}`}>
        <span>
          <span className="icon">
            <i className="fal fa-info-circle" />
          </span>
          <span className="text">{children}</span>
        </span>
      </div>
    );
  }
}

export default SubTitle;

SubTitle.defaultProps = {
  className: '',
};

SubTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
