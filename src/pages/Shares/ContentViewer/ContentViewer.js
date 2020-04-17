import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import request from '@/utils/request';
import './ContentViewer.scss';
import { setConfirm } from '@/actions';
import { ContentViewerMenu, PageContent, TopLogo } from '@/components';

class ContentViewer extends React.Component {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { shareId },
      },
    } = this.props;

    this.state = {
      topic: {},
      shareId: Number(shareId),
      share: {},
      chapters: [],
      pages: [],
      currentChapterId: null,
      currentPageId: null,
      currentPage: null,
    };
  }

  componentDidMount() {
    const { shareId } = this.state;
    this.getShare(shareId);
  }

  getShare = (shareId) => {
    request.get(`/api/shares/${shareId}`, null, (data) => {
      console.log(data);

      if (data && data.chapters) {
        data.chapters.sort((a, b) => {
          return a.orderNo - b.order;
        });
      }

      this.setState({
        topic: data.topic,
        chapters: data.chapters || [],
        share: data.share,
        currentChapterId: data.share.currentChapterId,
        currentPageId: data.share.currentPageId,
      });

      this.getPages(shareId, data.share.currentChapterId);
    });
  };

  getPages = (shareId, chapterId) => {
    request.get(
      `/api/shares/${shareId}/chapters/${chapterId}/pages`,
      {},
      (data) => {
        const { currentPageId } = this.state;
        this.setState({
          currentChapterId: chapterId,
          pages: data.pages || [],
          currentPage: data.pages.find((p) => p.id === currentPageId),
        });
      },
      null,
      true,
    );
  };

  setPageContent = (pageId, content) => {
    const { pages } = this.state;
    const next = pages.slice(0);
    const page = next.find((p) => p.id === pageId);
    if (page) {
      page.content = content;
    }

    this.setState({
      pages: next,
    });
  };

  setPage = (pageId) => {
    const { pages } = this.state;
    this.setState({
      currentPageId: pageId,
      currentPage: pages.find((p) => p.id === pageId),
    });
  };

  setChapter = (chapterId) => {
    const { shareId } = this.state;
    this.getPages(shareId, chapterId);
  };

  render() {
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { t, setConfirm } = this.props;
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { topic, shareId, share, chapters, pages, currentChapterId, currentPageId, currentPage } = this.state;

    return (
      <div className="content-viewer-wrapper">
        <div className="viewer-top g-no-select">
          <div className="logo-area">
            <TopLogo />
          </div>
          <div className="menu">
            <ContentViewerMenu
              className="chapters-menu"
              list={chapters}
              selectedId={currentChapterId}
              onClick={this.setChapter}
              onPrevClick={this.setChapter}
              onNextClick={this.setChapter}
            />
            <ContentViewerMenu
              className="pages-menu"
              list={pages}
              selectedId={currentPageId}
              onClick={this.setPage}
              onPrevClick={this.setPage}
              onNextClick={this.setPage}
            />
          </div>
          <div className="side-menu">
            <span>
              <i className="fal fa-wifi" />
            </span>
            <span>
              <i className="fal fa-id-badge" />
            </span>
            <span>
              <i className="fal fa-level-up" />
            </span>
            <span>
              <i className="fal fa-expand" />
            </span>
            <span>
              <i className="fal fa-poll" />
            </span>
            <span>
              <i className="fal fa-file-alt" />
            </span>
            <span>
              <i className="fal fa-solar-panel" />
            </span>
            <span className="d-none">
              <i className="fal fa-chart-line" />
            </span>
            <span className="d-none">
              <i className="fal fa-clock" />
            </span>
            <span className="d-none">
              <i className="fal fa-users-class" />
            </span>
            <span className="d-none">
              <i className="fal fa-cog" />
            </span>
          </div>
        </div>
        <div className="content">
          {currentPage && (
            <PageContent
              content={JSON.parse(currentPage.content)}
              setPageContent={this.setPageContent}
              onLayoutChange={this.onLayoutChange}
              setSelectedItem={this.setSelectedItem}
              onChangeValue={this.onChangeValue}
              setEditing={this.setEditing}
            />
          )}
        </div>
        <div className="prev-page" onClick={() => {}}>
          <div>
            <i className="fal fa-chevron-left" />
          </div>
        </div>
        <div className="next-page" onClick={() => {}}>
          <div>
            <i className="fal fa-chevron-right" />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
  };
};

ContentViewer.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      shareId: PropTypes.string,
      topicId: PropTypes.string,
      chapterId: PropTypes.string,
    }),
  }),
  setConfirm: PropTypes.func,
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(ContentViewer)));
