import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './PageContent.scss';

class PageContent extends React.PureComponent {
  render() {
    const { className, pageId, content } = this.props;

    console.log(pageId, content);



    return (
      <div className={`page-content-wrapper g-no-select ${className}`}>
        <div>
          {pageId} {content}
        </div>
      </div>
    );
  }
}

PageContent.propTypes = {
  className: PropTypes.string,
  pageId: PropTypes.number,
  content: PropTypes.string,
};

export default withRouter(withTranslation()(PageContent));
