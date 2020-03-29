import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FullLayout } from '@/layouts';
import request from '@/utils/request';
import { Button, EmptyMessage, ListControlBar } from '@/components';
import ChapterCardLayoutList from './ChapterCardLayoutList';
import './ChapterList.scss';
import '@/styles/lib/react-grid-layout.scss';

class ChapterList extends React.PureComponent {
  breakpoint = 'lg';

  constructor(props) {
    super(props);

    const {
      match: {
        params: { topicId },
      },
    } = this.props;

    this.state = {
      topicId,
      topic: {},
      chapters: false,
      viewType: 'list',
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
    request.get('/api/chapters', { topicId }, (data) => {
      data.chapters.sort((a, b) => {
        return a.orderNo - b.order;
      });

      this.setState({
        topic: data.topic || {},
        chapters: data.chapters || [],
      });
    });
  };

  createChapter = () => {
    const { topicId, chapters } = this.state;
    const orderNo = chapters.length + 1;
    const title = `CHAPTER-${orderNo}`;

    request.post(
      '/api/chapters',
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
    request.del(
      `/api/chapters/${chapterId}`,
      null,
      () => {
        const { chapters } = this.state;
        const next = chapters.slice(0);
        const index = next.findIndex((chapter) => chapter.id === chapterId);

        if (index > -1) {
          next.splice(index, 1);

          this.setState({
            chapters: next,
          });
        }
      },
      null,
      true,
    );
  };

  updateChapterTitle = (chapterId, title) => {
    request.put(
      `/api/chapters/${chapterId}/title`,
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
    request.put('/api/chapters/orders', { topicId, chapters }, null, null, true);
  };

  onChangeViewType = (viewType) => {
    this.setState({
      viewType,
    });
  };

  setChapters = (chapters) => {
    this.setState({
      chapters,
    });
  };

  render() {
    const { t } = this.props;
    const { topic, chapters, viewType } = this.state;

    return (
      <div className="chapter-list-wrapper">
        <ListControlBar
          className="flex-grow-0"
          viewType={viewType}
          onChangeViewType={this.onChangeViewType}
          title={
            <>
              <span className="topic-tag g-tag bg-primary mr-2">TOPIC</span>
              <span className="mr-3 topic-name">{topic.name}</span>
              <div className="summary">
                <span className="chapter-count mr-1">{chapters.length}</span>
                <span className="summary-label">CHAPTERS</span>
                <span className="page-count ml-2 mr-1">0</span>
                <span className="summary-label">PAGES</span>
              </div>
            </>
          }
          buttons={[
            <Button key="add" onClick={this.createChapter} className="option" color="white" size="sm">
              <i className="fal fa-plus" /> 챕터 추가
            </Button>,
          ]}
        />
        <div className="d-none">
          반응형 처리, 권한에 따른 기능 및 버튼 제한 (쓰기 권한 없으면, 드래그 안되고, 변경 삭제 버튼 노출되면 안됨),
          카드형, 리스트형 보기 처리
        </div>
        {chapters !== false && (
          <FullLayout className="flex-grow-1">
            {chapters.length < 1 && (
              <EmptyMessage
                className="h5 text-white"
                message={
                  <div>
                    <div className="mb-2">{t('아직 생성된 챕터가 없습니다')}</div>
                    <div className="mb-4">{t('챕터를 추가해서, 토픽을 만들기를 시작해보세요.')}</div>
                    <Button onClick={this.createChapter} color="white">
                      <i className="fal fa-plus mr-2" />
                      챕터 추가
                    </Button>
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
                viewType={viewType}
                rowHeight={120}
                gridSetting={{
                  breakpoints: { lg: 1201, md: 992, sm: 768, xs: 576 },
                  cols: { lg: 5, md: 4, sm: 3, xs: 1 },
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
                viewType={viewType}
                rowHeight={40}
                gridSetting={{
                  breakpoints: { lg: 1201, md: 992, sm: 768, xs: 576 },
                  cols: { lg: 1, md: 1, sm: 1, xs: 1 },
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
              />
            )}
          </FullLayout>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    organizations: state.user.organizations,
  };
};

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

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ChapterList)));
