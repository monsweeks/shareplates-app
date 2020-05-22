import React from 'react';
import PropTypes from 'prop-types';
import './PageIntro.scss';

class PageIntro extends React.PureComponent {
  render() {
    const { children, className } = this.props;
    return (
      <div className={`page-intro-wrapper ${className}`}>
        <span className='info-icon'>
          <i className="fas fa-info-circle" />
        </span>
        <span>{children}</span>
      </div>
    );
  }
}

export default PageIntro;

PageIntro.defaultProps = {
  className: '',
};

PageIntro.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
