import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FullLayout } from '@/layouts';
import request from '@/utils/request';
import { Button, ChapterCard } from '@/components';
import './ChapterList.scss';
import '@/styles/lib/react-grid-layout.scss';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export const GRID_SETTINGS = {
  breakpoints: { lg: 1201, md: 992, sm: 768, xs: 576 },
  cols: { lg: 6, md: 4, sm: 3, xs: 1 },
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
      chapters: [],
      gridLayouts: this.getEmptyGridLayout(GRID_SETTINGS),
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
      this.getTopics(topicId);
    }
  }

  getEmptyGridLayout = (gridSettings) => {
    const gridLayouts = {};
    Object.keys(gridSettings.cols).forEach((breakpoint) => {
      gridLayouts[breakpoint] = [];
    });

    return gridLayouts;
  };

  getTopics = (topicId) => {
    request.get('/api/chapters', { topicId }, (data) => {
      console.log(data);
      const gridLayouts = this.getEmptyGridLayout(GRID_SETTINGS);

      data.chapters.forEach((chapter) => {
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

    request.post('/api/chapters', { topicId, title, orderNo }, (data) => {
      const next = chapters.slice(0);
      next.push(data.chapter);
      this.setState({
        chapters: next,
      });
    });
  };

  deleteChapter = (chapterId) => {
    request.del(`/api/chapters/${chapterId}`, null, () => {
      const { chapters } = this.state;
      const next = chapters.slice(0);
      const index = next.findIndex((chapter) => chapter.id === chapterId);

      if (index > -1) {
        next.splice(index, 1);
        this.setState({
          chapters: next,
        });
      }
    });
  };

  onLayoutChange = (layout, layouts) => {
    const { chapters } = this.state;

    // 현재 레이아웃 정보에서 col과 row 기준으로 순서대로 정렬
    layout.sort((a, b) => {
      return a.y * GRID_SETTINGS.cols[this.breakpoint] + a.x - (b.y * GRID_SETTINGS.cols[this.breakpoint] + b.x);
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

    this.setState(
      {
        chapters: nextChapters,
        gridLayouts: nextGridLayouts,
      },
      () => {
        // update chapters orders
      },
    );
  };

  getX = (breakpoint, orderNo) => {
    const next = (orderNo % GRID_SETTINGS.cols[breakpoint]) - 1;
    if (next < 0) {
      return GRID_SETTINGS.cols[breakpoint] - 1;
    }
    return next;
  };

  getY = (breakpoint, orderNo) => {
    return Math.floor((orderNo - 1) / GRID_SETTINGS.cols[breakpoint]);
  };

  render() {
    const { topic, chapters, gridLayouts } = this.state;

    return (
      <FullLayout className="chapter-list-wrapper">
        <div className="chapter-list pt-4">
          <div className="text-white text-center">{topic.name}</div>
          <div className="text-right p-4">
            <Button
              onClick={() => {
                this.createChapter();
              }}
            >
              추가
            </Button>
          </div>
          {chapters.length > 0 && (
            <ResponsiveReactGridLayout
              onLayoutChange={this.onLayoutChange}
              className="layout"
              breakpoints={GRID_SETTINGS.breakpoints}
              cols={GRID_SETTINGS.cols}
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
                    data-grid={{
                      i: String(chapter.id),
                      w: 1,
                      h: 1,
                      x: this.getX(this.breakpoint, chapter.orderNo),
                      y: this.getY(this.breakpoint, chapter.orderNo),
                      minW: 1,
                      minH: 1,
                    }}
                  >
                    <ChapterCard
                      chapter={chapter}
                      onCardClick={(chapterId) => {
                        console.log(chapterId);
                      }}
                      onRemoveClick={(chapterId) => {
                        this.deleteChapter(chapterId);
                      }}
                    />
                  </div>
                );
              })}
            </ResponsiveReactGridLayout>
          )}
        </div>
      </FullLayout>
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
    }),
  }),
};

export default withRouter(connect(mapStateToProps, undefined)(ChapterList));
