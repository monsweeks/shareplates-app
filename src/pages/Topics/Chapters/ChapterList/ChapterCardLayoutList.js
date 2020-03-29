import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import { ChapterCard } from '@/components';

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

function getX(breakpoint, orderNo) {
  const next = (orderNo % CARD_GRID_SETTINGS.cols[breakpoint]) - 1;
  if (next < 0) {
    return CARD_GRID_SETTINGS.cols[breakpoint] - 1;
  }
  return next;
}

function getY(breakpoint, orderNo) {
  return Math.floor((orderNo - 1) / CARD_GRID_SETTINGS.cols[breakpoint]);
}

function getEmptyGridLayout(gridSettings) {
  const gridLayouts = {};
  Object.keys(gridSettings.cols).forEach((breakpoint) => {
    gridLayouts[breakpoint] = [];
  });

  return gridLayouts;
}

class ChapterCardLayoutList extends React.PureComponent {
  timer = null;

  breakpoint = 'lg';

  constructor(props) {
    super(props);
    this.state = {
      gridLayouts: getEmptyGridLayout(CARD_GRID_SETTINGS),
      init: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.init && props.chapters) {
      const gridLayouts = getEmptyGridLayout(CARD_GRID_SETTINGS);
      Object.keys(CARD_GRID_SETTINGS.cols).forEach((breakpoint) => {
        gridLayouts[breakpoint] = [];
      });
      props.chapters.forEach((chapter) => {
        Object.keys(gridLayouts).forEach((breakpoint) => {
          gridLayouts[breakpoint].push({
            ...DEFAULT_LAYOUT_INFO,
            i: String(chapter.id),
            x: getX(breakpoint, chapter.orderNo),
            y: getY(breakpoint, chapter.orderNo),
          });
        });
      });

      return {
        init: true,
        gridLayouts,
      };
    }

    return null;
  }

  onLayoutChange = (layout, layouts) => {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    setTimeout(() => {
      this.applyLayout(layout, layouts);
    }, 100);
  };

  applyLayout = (layout, layouts) => {
    const { topicId, updateChapterOrders, chapters, setChapters } = this.props;

    if (!chapters) {
      return;
    }

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
          layoutInfo.x = getX(breakpoint, inx + 1);
          layoutInfo.y = getY(breakpoint, inx + 1);
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
      updateChapterOrders(topicId, afterOrders);
    }

    this.setState({
      gridLayouts: nextGridLayouts,
    });

    setChapters(nextChapters);
  };

  render() {
    const { updateChapterTitle, deleteChapter, chapters } = this.props;
    const { gridLayouts } = this.state;

    console.log(gridLayouts);

    return (
      <div className="chapter-card-layout-list">
        {chapters !== false && chapters.length > 0 && (
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
                        deleteChapter(chapterId);
                      }}
                      onChangeTitle={updateChapterTitle}
                    />
                  </div>
                );
              })}
            </ResponsiveReactGridLayout>
          </div>
        )}
      </div>
    );
  }
}

ChapterCardLayoutList.propTypes = {
  updateChapterTitle: PropTypes.func,
  updateChapterOrders: PropTypes.func,
  deleteChapter: PropTypes.func,
  chapters: PropTypes.arrayOf(PropTypes.any),
  topicId: PropTypes.number,
  setChapters: PropTypes.func,
};

export default ChapterCardLayoutList;
