import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { FullLayout } from '@/layouts';
import request from '@/utils/request';
import { Button, EmptyMessage, ListControlBar } from '@/components';
import { ChapterCardLayoutList } from '@/assets';
import storage from '@/utils/storage';
import './ChapterList.scss';
import { DEFAULT_CHAPTER_CONTENT } from '@/assets/Topics/PageEditor/PageController/constants';

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
    const content = {
      chapterProperties: JSON.parse(JSON.stringify(DEFAULT_CHAPTER_CONTENT.chapterProperties)),
    };

    request.post(
      `/api/topics/${topicId}/chapters`,
      { topicId, title, orderNo, content: JSON.stringify(content) },
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

  updateChapterOrders = () => {
    const { topicId, chapters } = this.state;
    request.put(`/api/topics/${topicId}/chapters/orders`, { topicId, chapters }, null, null, true);
  };

  moveChapter = (targetChapterId, destChapterId, right) => {
    if (targetChapterId === destChapterId) {
      return;
    }

    const { chapters } = this.state;
    const next = chapters.slice(0);

    const targetIndex = next.findIndex((chapter) => chapter.id === targetChapterId);
    const target = next[targetIndex];
    next.splice(targetIndex, 1);

    const destIndex = next.findIndex((chapter) => chapter.id === destChapterId);
    if (right) {
      next.splice(destIndex + 1, 0, target);
    } else {
      next.splice(destIndex, 0, target);
    }

    next.forEach((d, i) => {
      // eslint-disable-next-line no-param-reassign
      d.orderNo = i + 1;
    });

    this.setState({
      chapters: next,
    });
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
                    <i className="fal fa-plus" /> 새로운 챕터
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
          {isWriter && (
            <Button key="add" onClick={this.createChapter} className="add-button option" color="white" size="sm">
              <i className="fal fa-plus" /> 새로운 챕터
            </Button>
          )}
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
                        새로운 챕터
                      </Button>
                    )}
                  </div>
                }
              />
            )}
            <ChapterCardLayoutList
              topicId={topic.id}
              chapters={chapters}
              moveChapter={this.moveChapter}
              updateChapterOrders={this.updateChapterOrders}
              updateChapterTitle={this.updateChapterTitle}
              deleteChapter={this.deleteChapter}
              setChapters={this.setChapters}
              onChapterClick={this.moveToPages}
              createChapter={this.createChapter}
              viewType={viewType}
              isWriter={isWriter}
            />
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
