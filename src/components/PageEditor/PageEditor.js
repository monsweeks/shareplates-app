import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageContent, PropertyManager } from '@/components';
import './PageEditor.scss';

class PageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      pageId: -1,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.pageId !== state.pageId) {
      return {
        pageId: props.pageId,
        content: props.content,
      };
    }

    return null;
  }

  setPageContent = () => {
    const { setPageContent } = this.props;
    const { pageId, content } = this.state;
    setPageContent(pageId, content);
  };

  render() {
    const { className, setPageContent, ...last } = this.props;
    const { pageId, content } = this.state;

    return (
      <div className={`page-editor-wrapper g-no-select ${className}`}>
        <PropertyManager className="property-manager" {...last} />
        <div className="editor-content">
          <PageContent pageId={pageId} content={content} setPageContent={this.setPageContent} />
        </div>
      </div>
    );
  }
}

PageEditor.propTypes = {
  className: PropTypes.string,
  setPageContent: PropTypes.func,
  pageId: PropTypes.number,
  content: PropTypes.string,
};

export default withRouter(PageEditor);
