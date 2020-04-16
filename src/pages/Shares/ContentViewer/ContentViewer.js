import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import request from '@/utils/request';
import './ContentViewer.scss';
import { setConfirm } from '@/actions';
import { TopLogo } from '@/components';

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

  render() {
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { t, setConfirm } = this.props;
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { topic, shareId, share, chapters, pages, currentChapterId, currentPageId, currentPage } = this.state;

    console.log(pages);

    console.log(chapters);

    console.log(currentChapterId, currentPageId);

    return (
      <div className="content-viewer-wrapper">
        <div className="viewer-top">
          <div className="logo-area">
            <TopLogo />
          </div>
          <div className="menu">
            <div className="chapters">
              <div>
                <ul>
                  {chapters.map((chapter) => {
                    return (
                      <li
                        key={chapter.id}
                        className={currentChapterId === chapter.id ? 'selected' : ''}
                        onClick={() => {
                          this.getPages(shareId, chapter.id);
                        }}
                      >
                        {chapter.title}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="pages">
              <div>
                <ul>
                  {pages.map((page) => {
                    return (
                      <li
                        key={page.id}
                        className={currentPageId === page.id ? 'selected' : ''}
                        onClick={() => {
                          console.log(pages.find((p) => p.id === page.id));
                          this.setState({
                            currentPageId: page.id,
                            currentPage: pages.find((p) => p.id === page.id),
                          });
                        }}
                      >
                        {page.title}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div className="side-menu">1</div>
        </div>
        <div className="content">{currentPage && <div>{currentPage.content}</div>}</div>
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
