import React from 'react';
import './PageTitle.scss';
import PropTypes from 'prop-types';
import { Breadcrumbs } from '@/layouts';

class PageTitle extends React.PureComponent {
  render() {
    const { children, className, list, border } = this.props;
    return (
      <div className={`page-title-wrapper ${className} ${border ? 'has-border' : ''}`}>
        <h1>
          <span className='icon'>
            <i className="fal fa-star" />
          </span>
          <span className='text'>{children}</span>
          <span className='breadcrumbs'>
            <Breadcrumbs list={list} />
          </span>
        </h1>
      </div>
    );
  }
}

export default PageTitle;

PageTitle.defaultProps = {
  className: '',
  border : false,
};

PageTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
  border : PropTypes.bool,
};
