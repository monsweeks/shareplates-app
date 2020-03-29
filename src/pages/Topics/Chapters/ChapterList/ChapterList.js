import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FullLayout } from '@/layouts';
import request from '@/utils/request';
import { Button, ChapterCard, EmptyMessage, ListControlBar } from '@/components';
import './ChapterList.scss';
import '@/styles/lib/react-grid-layout.scss';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const CARD_GRID_SETTINGS = {
  breakpoints: { lg: 1201, md: 992, sm: 768, xs: 576 },
  cols: { lg: 5, md: 4, sm: 3, xs: 1 },
  defaultBoxSize: {
    lg: {
      width: 2,
      height: 4,
    },
    md: {
      width: 2,
      height: 4,
    },
  },
};

export const LIST_GRID_SETTINGS = {
  breakpoints: { lg: 1201, md: 992, sm: 768, xs: 576 },
  cols: { lg: 1, md: 1, sm: 1, xs: 1 },
  defaultBoxSize: {
    lg: {
      width: 2,
      height: 4,
    },
    md: {
      width: 2,
      height: 4,
    },
  },
};

const DEFAULT_LAYOUT_INFO = {
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
};

class ChapterList extends React.PureComponent {
  timer = null;

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
      gridLayouts: this.getEmptyGridLayout(CARD_GRID_SETTINGS),
      viewType: 'card',
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

  getEmptyGridLayout = (gridSettings) => {
    const gridLayouts = {};
    Object.keys(gridSettings.cols).forEach((breakpoint) => {
      gridLayouts[breakpoint] = [];
    });

    return gridLayouts;
  };

  getChapters = (topicId) => {
    request.get('/api/chapters', { topicId }, (data) => {
      const gridLayouts = this.getEmptyGridLayout(CARD_GRID_SETTINGS);

      data.chapters
        .sort((a, b) => {
          return a.orderNo - b.order;
        })
        .forEach((chapter) => {
          Object.keys(gridLayouts).forEach((breakpoint) => {
            gridLayouts[breakpoint].push({
              ...DEFAULT_LAYOUT_INFO,
              i: String(chapter.id),
              x: this.getX(breakpoint, chapter.orderNo),
              y: this.getY(breakpoint, chapter.orderNo),
            });
          });
        });

      this.setState({
        topic: data.topic || {},
        chapters: data.chapters || [],
        gridLayouts,
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

  onLayoutChange = (layout, layouts) => {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    setTimeout(() => {
      this.applyLayout(layout, layouts);
    }, 300);

    /*
    const { topicId, chapters } = this.state;

    // 순서 변경을 감지하기 위해, 변경전 순서를 기록
    const beforeOrders = chapters.map((chapter) => {
      return {
        id: chapter.id,
        orderNo: chapter.orderNo,
      };
    });

    // 현재 레이아웃 정보에서 col과 row 기준으로 순서대로 정렬
    layout.sort((a, b) => {
      return (
        a.y * CARD_GRID_SETTINGS.cols[this.breakpoint] + a.x - (b.y * CARD_GRID_SETTINGS.cols[this.breakpoint] + b.x)
      );
    });

    // 정렬된 순서로 챕터의 orderNo를 다시 지정하고, 빈 곳이 없도록 레이아웃의 위치를 순서대로 다시 작성한다.
    const nextChapters = [];
    const nextGridLayouts = { ...layouts };
    layout.forEach((item, inx) => {
      const chapterInfo = chapters.find((chapter) => String(chapter.id) === String(item.i));
      nextChapters.push({
        ...chapterInfo,
        orderNo: inx + 1,
      });

      Object.keys(nextGridLayouts).forEach((breakpoint) => {
        const layoutInfo = nextGridLayouts[breakpoint].find((d) => String(d.i) === String(item.i));
        if (layoutInfo) {
          layoutInfo.x = this.getX(breakpoint, inx + 1);
          layoutInfo.y = this.getY(breakpoint, inx + 1);
        }
      });
    });

    const afterOrders = nextChapters.map((chapter) => {
      return {
        id: chapter.id,
        orderNo: chapter.orderNo,
      };
    });

    // 순서가 변경되었다면, 업데이트
    if (JSON.stringify(beforeOrders) !== JSON.stringify(afterOrders)) {
      this.updateChapterOrders(topicId, afterOrders);
    }

    this.setState({
      chapters: nextChapters,
      gridLayouts: nextGridLayouts,
    });


     */
  };

  applyLayout = (layout, layouts) => {
    const { topicId, chapters } = this.state;

    // 순서 변경을 감지하기 위해, 변경전 순서를 기록
    const beforeOrders = chapters.map((chapter) => {
      return {
        id: chapter.id,
        orderNo: chapter.orderNo,
      };
    });

    console.log({ ...layout });
    // 현재 레이아웃 정보에서 col과 row 기준으로 순서대로 정렬
    layout.sort((a, b) => {
      return (
        a.y * CARD_GRID_SETTINGS.cols[this.breakpoint] + a.x - (b.y * CARD_GRID_SETTINGS.cols[this.breakpoint] + b.x)
      );
    });

    // 정렬된 순서로 챕터의 orderNo를 다시 지정하고, 빈 곳이 없도록 레이아웃의 위치를 순서대로 다시 작성한다.
    const nextChapters = [];
    const nextGridLayouts = { ...layouts };
    layout.forEach((item, inx) => {
      const chapterInfo = chapters.find((chapter) => String(chapter.id) === String(item.i));
      nextChapters.push({
        ...chapterInfo,
        orderNo: inx + 1,
      });

      Object.keys(nextGridLayouts).forEach((breakpoint) => {
        const layoutInfo = nextGridLayouts[breakpoint].find((d) => String(d.i) === String(item.i));
        if (layoutInfo) {
          layoutInfo.x = this.getX(breakpoint, inx + 1);
          layoutInfo.y = this.getY(breakpoint, inx + 1);
        }
      });
    });

    const afterOrders = nextChapters.map((chapter) => {
      return {
        id: chapter.id,
        orderNo: chapter.orderNo,
      };
    });

    // 순서가 변경되었다면, 업데이트
    if (JSON.stringify(beforeOrders) !== JSON.stringify(afterOrders)) {
      this.updateChapterOrders(topicId, afterOrders);
    }

    this.setState({
      chapters: nextChapters,
      gridLayouts: nextGridLayouts,
    });
  };

  getX = (breakpoint, orderNo) => {
    const next = (orderNo % CARD_GRID_SETTINGS.cols[breakpoint]) - 1;
    if (next < 0) {
      return CARD_GRID_SETTINGS.cols[breakpoint] - 1;
    }
    return next;
  };

  getY = (breakpoint, orderNo) => {
    return Math.floor((orderNo - 1) / CARD_GRID_SETTINGS.cols[breakpoint]);
  };

  onChangeViewType = (viewType) => {
    this.setState({
      viewType,
    });
  };

  render() {
    const { t } = this.props;
    const { topic, chapters, gridLayouts, viewType } = this.state;


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
            {chapters.length > 0 && (
              <div className="chapter-list pt-4">
                <ResponsiveReactGridLayout
                  onLayoutChange={this.onLayoutChange}
                  className="layout"
                  breakpoints={CARD_GRID_SETTINGS.breakpoints}
                  cols={CARD_GRID_SETTINGS.cols}
                  rowHeight={120}
                  isResizable={false}
                  compactType="horizontal"
                  verticalCompact
                  layouts={gridLayouts}
                  onBreakpointChange={(newBreakpoint) => {
                    this.breakpoint = newBreakpoint;
                  }}
                  useCSSTransforms={false}
                  // layout={gridLayouts}
                >
                  {chapters.map((chapter) => {
                    return (
                      <div
                        key={chapter.id}
                        data-grid={gridLayouts[this.breakpoint].find((d) => String(d.id) === String(chapter.id))}
                      >
                        <ChapterCard
                          chapter={chapter}
                          onCardClick={(chapterId) => {
                            console.log(chapterId);
                          }}
                          onRemoveClick={(chapterId) => {
                            this.deleteChapter(chapterId);
                          }}
                          onChangeTitle={this.updateChapterTitle}
                        />
                      </div>
                    );
                  })}
                </ResponsiveReactGridLayout>
              </div>
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
