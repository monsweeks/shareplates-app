import React from 'react';
import PropTypes from 'prop-types';
import './PageContent.scss';

class PageContent extends React.PureComponent {
  render() {
    const { className, children } = this.props;
    return <div className={`page-content-wrapper ${className}`}>{children}</div>;
  }
}

export default PageContent;

PageContent.defaultProps = {
  className: '',
};

PageContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
