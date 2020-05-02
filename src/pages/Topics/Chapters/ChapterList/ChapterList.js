import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FullLayout } from '@/layouts';
import request from '@/utils/request';
import { Button, EmptyMessage, ListControlBar } from '@/components';
import ChapterCardLayoutList from './ChapterCardLayoutList';
import './ChapterList.scss';
import '@/styles/lib/react-grid-layout.scss';
import storage from '@/utils/storage';

class ChapterList extends React.PureComponent {

  constructor(props) {
    super(props);
    const viewType = storage.getItem('chapters', 'viewType');
    const {
      match: {
        params: { topicId },
      },
    } = this.props;

    this.state = {
      topicId,
      topic: {},
      chapters: false,
      viewType: viewType || 'card',
      role: 'NONE',
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.match.params.topicId && state.topicId !== props.match.params.topicId) {
      return {
        topicId: props.match.params.topicId,
      };
    }

    return null;
  }

  componentDidMount() {
    const { topicId } = this.state;

    if (topicId) {
      this.getChapters(topicId);
    }
  }

  getChapters = (topicId) => {
    request.get(`/api/topics/${topicId}/chapters`, { topicId }, (data) => {
      data.chapters.sort((a, b) => {
        return a.orderNo - b.order;
      });

      this.setState({
        topic: data.topic || {},
        chapters: data.chapters || [],
        role: data.role,
      });
    });
  };

  createChapter = () => {
    const { topicId, chapters } = this.state;
    const orderNo = chapters.length + 1;
    const title = `CHAPTER-${orderNo}`;

    request.post(
      `/api/topics/${topicId}/chapters`,
      { topicId, title, orderNo },
      (data) => {
        const next = chapters.slice(0);
        next.push(data.chapter);
        this.setState({
          chapters: next,
        });
      },
      null,
      true,
    );
  };

  deleteChapter = (chapterId) => {
    const { topicId } = this.state;

    request.del(
      `/api/topics/${topicId}/chapters/${chapterId}`,
      null,
      (data) => {

        console.log(data);

        const { chapters } = this.state;
        const next = chapters.slice(0);
        const index = next.findIndex((chapter) => chapter.id === chapterId);

        if (index > -1) {
          next.splice(index, 1);
          this.setState({
            topic: data || {},
            chapters: next,
          });
        } else {
          this.setState({
            topic: data || {},
          });
        }
      },
      null,
      true,
    );
  };

  updateChapterTitle = (chapterId, title) => {
    const { topicId } = this.state;
    request.put(
      `/api/topics/${topicId}/chapters/${chapterId}/title`,
      { title },
      (data) => {
        const { chapters } = this.state;
        const next = chapters.slice(0);
        const chapter = next.find((d) => String(d.id) === String(data.chapter.id));
        chapter.title = data.chapter.title;
        this.setState({
          chapters: next,
        });
      },
      null,
      true,
    );
  };

  updateChapterOrders = (topicId, chapters) => {
    request.put(`/api/topics/${topicId}/chapters/orders`, { topicId, chapters }, null, null, true);
  };

  onChangeViewType = (viewType) => {
    storage.setItem('chapters', 'viewType', viewType);
    this.setState({
      viewType,
    });
  };

  setChapters = (chapters) => {
    this.setState({
      chapters,
    });
  };

  moveToPages = (chapterId) => {
    const { history } = this.props;
    const { topic } = this.state;
    history.push(`/topics/${topic.id}/chapters/${chapterId}/pages`);
  };

  render() {
    const { t } = this.props;
    const { topic, chapters, viewType, role } = this.state;
    const isWriter = role === 'WRITE';

    return (
      <div className="chapter-list-wrapper">
        <ListControlBar
          className="list-control-bar flex-grow-0"
          viewType={viewType}
          onChangeViewType={this.onChangeViewType}
          title={
            <>
              <span className="topic-tag g-tag bg-primary mr-2">TOPIC</span>
              <span className="mr-3 topic-name">{topic.name}</span>
              <div className="summary">
                <span className="chapter-count mr-1">{chapters.length}</span>
                <span className="summary-label">CHAPTERS</span>
                <span className="page-count ml-2 mr-1">{topic.pageCount}</span>
                <span className="summary-label">PAGES</span>
              </div>
            </>
          }
          buttons={
            isWriter
              ? [
                  <Button key="add" onClick={this.createChapter} className="add-button option" color="white" size="sm">
                    <i className="fal fa-plus" /> 챕터 추가
                  </Button>,
                ]
              : []
          }
        />
        <div className="sm-control-bar">
          <div className="summary sm-summary">
            <span className="chapter-count mr-1">{chapters.length}</span>
            <span className="summary-label">CHAPTERS</span>
            <span className="page-count ml-2 mr-1">0</span>
            <span className="summary-label">PAGES</span>
          </div>
          <Button key="add" onClick={this.createChapter} className="add-button option" color="white" size="sm">
            <i className="fal fa-plus" /> 챕터 추가
          </Button>
        </div>
        {chapters !== false && (
          <FullLayout className="flex-grow-1">
            {chapters.length < 1 && (
              <EmptyMessage
                className="h5 text-white"
                message={
                  <div>
                    <div className="mb-2">{t('아직 생성된 챕터가 없습니다')}</div>
                    {isWriter && <div className="mb-4">{t('챕터를 추가해서, 토픽을 만들기를 시작해보세요.')}</div>}
                    {isWriter && (
                      <Button onClick={this.createChapter} color="white">
                        <i className="fal fa-plus mr-2" />
                        챕터 추가
                      </Button>
                    )}
                  </div>
                }
              />
            )}
            {viewType === 'card' && (
              <ChapterCardLayoutList
                topicId={topic.id}
                chapters={chapters}
                updateChapterOrders={this.updateChapterOrders}
                updateChapterTitle={this.updateChapterTitle}
                deleteChapter={this.deleteChapter}
                setChapters={this.setChapters}
                onChapterClick={this.moveToPages}
                viewType={viewType}
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
                isWriter={isWriter}
              />
            )}
            {viewType === 'list' && (
              <ChapterCardLayoutList
                topicId={topic.id}
                chapters={chapters}
                updateChapterOrders={this.updateChapterOrders}
                updateChapterTitle={this.updateChapterTitle}
                deleteChapter={this.deleteChapter}
                setChapters={this.setChapters}
                onChapterClick={this.moveToPages}
                viewType={viewType}
                rowHeight={40}
                margin={[12, 4]}
                gridSetting={{
                  breakpoints: { lg: 1201, md: 992, sm: 768, xs: 576, xxs: 0 },
                  cols: { lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 },
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
                isWriter={isWriter}
              />
            )}
          </FullLayout>
        )}
      </div>
    );
  }
}

ChapterList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  t: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
    }),
  }),
};

export default withRouter(withTranslation()(ChapterList));
