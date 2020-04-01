import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, PageManagerTopControlBar } from '@/components';
import request from '@/utils/request';
import './PageManager.scss';
import PageCardLayoutList from '@/pages/Topics/Chapters/Pages/PageManager/PageCardLayoutList';

class PageManager extends React.Component {
  constructor(props) {
    super(props);
    const {
      match: {
        params: { topicId, chapterId },
      },
    } = this.props;

    this.state = {
      topicId: Number(topicId),
      chapterId: Number(chapterId),
      chapter: {},
      pages: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.match.params.topicId &&
      props.match.params.chapterId &&
      (state.topicId !== props.match.params.topicId || state.chapterId !== props.match.params.chapterId)
    ) {
      return {
        topicId: props.match.params.topicId,
        chapterId: props.match.params.chapterId,
      };
    }

    return null;
  }

  componentDidMount() {
    const { topicId, chapterId } = this.state;

    if (topicId && chapterId) {
      this.getPages(topicId, chapterId);
    }
  }

  getPages = (topicId, chapterId) => {
    request.get(`/api/topics/${topicId}/chapters/${chapterId}/pages`, {}, (data) => {
      this.setState({
        chapter: data.chapter || {},
        pages: data.pages || [],
      });
    });
  };

  setPages = (pages) => {
    this.setState({
      pages,
    });
  };

  createPage = () => {
    const { topicId, chapterId, pages } = this.state;
    const orderNo = pages.length + 1;
    const title = `PAGE-${orderNo}`;

    request.post(
      `/api/topics/${topicId}/chapters/${chapterId}/pages`,
      { topicId, chapterId, title, orderNo },
      (data) => {
        const next = pages.slice(0);
        next.push(data.page);
        this.setState({
          pages: next,
        });
      },
      null,
      true,
    );
  };

  render() {
    const { t } = this.props;
    const { topicId, chapterId, chapter, pages } = this.state;

    console.log(pages);
    return (
      <div className="page-manager-wrapper">
        <div className="page-list-layout">
          <PageManagerTopControlBar
            title={chapter && chapter.title}
            t={t}
            buttons={[
              <Button key="add" onClick={this.createPage} className="g-icon-button" color="white" size="sm">
                <div>
                  <i className="fal fa-plus" />
                </div>
              </Button>,
            ]}
          />
          <div className="page-list">
            <div className='scrollbar'>
              <PageCardLayoutList
                topicId={topicId}
                chapterId={chapterId}
                pages={pages}
                updatePageOrders={this.updateChapterOrders}
                updatePageTitle={this.updateChapterTitle}
                deletePage={this.deleteChapter}
                setPages={this.setPages}
                onPageClick={this.moveToPages}
                rowHeight={120}
                margin={[12, 12]}
                gridSetting={{
                  breakpoints: { lg: 1201, md: 992, sm: 768, xs: 576, xxs: 0 },
                  cols: { lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 },
                  defaultBox: {
                    w: 1,
                    h: 1,
                    minW: 1,
                    maxW: 1,
                    minH: 1,
                    maxH: 1,
                    moved: false,
                    static: false,
                    isDraggable: true,
                    isResizable: false,
                  },
                }}
                isWriter
              />
            </div>
          </div>
        </div>
        <div className="page-editor" />
      </div>
    );
  }
}

PageManager.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
      chapterId: PropTypes.string,
    }),
  }),
};

export default withRouter(withTranslation()(PageManager));
