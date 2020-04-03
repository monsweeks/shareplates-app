import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import PropTypes from 'prop-types';
import { PageCard } from '@/components';
import '@/styles/lib/react-grid-layout.scss';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
function getX(gridSetting, breakpoint, orderNo) {
  const next = (orderNo % gridSetting.cols[breakpoint]) - 1;
  if (next < 0) {
    return gridSetting.cols[breakpoint] - 1;
  }
  return next;
}

function getY(gridSetting, breakpoint, orderNo) {
  return Math.floor((orderNo - 1) / gridSetting.cols[breakpoint]);
}

function getEmptyGridLayout(gridSetting) {
  const gridLayouts = {};
  Object.keys(gridSetting.cols).forEach((breakpoint) => {
    gridLayouts[breakpoint] = [];
  });

  return gridLayouts;
}

class PageCardLayoutList extends React.PureComponent {
  timer = null;

  breakpoint = 'lg';

  constructor(props) {
    super(props);
    this.state = {
      gridLayouts: {},
      init: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.init && props.pages) {
      const gridLayouts = getEmptyGridLayout(props.gridSetting);
      Object.keys(props.gridSetting.cols).forEach((breakpoint) => {
        gridLayouts[breakpoint] = [];
      });
      props.pages.forEach((chapter) => {
        Object.keys(gridLayouts).forEach((breakpoint) => {
          gridLayouts[breakpoint].push({
            ...props.gridSetting.defaultBox,
            i: String(chapter.id),
            x: getX(props.gridSetting, breakpoint, chapter.orderNo),
            y: getY(props.gridSetting, breakpoint, chapter.orderNo),
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
    const { topicId, chapterId, updatePageOrders, pages, setPages, gridSetting } = this.props;

    if (!pages) {
      return;
    }

    // 순서 변경을 감지하기 위해, 변경전 순서를 기록
    const beforeOrders = pages.map((chapter) => {
      return {
        id: chapter.id,
        orderNo: chapter.orderNo,
      };
    });

    // 현재 레이아웃 정보에서 col과 row 기준으로 순서대로 정렬
    layout.sort((a, b) => {
      return a.y * gridSetting.cols[this.breakpoint] + a.x - (b.y * gridSetting.cols[this.breakpoint] + b.x);
    });

    // 정렬된 순서로 챕터의 orderNo를 다시 지정하고, 빈 곳이 없도록 레이아웃의 위치를 순서대로 다시 작성한다.
    const nextChapters = [];
    const nextGridLayouts = { ...layouts };
    layout.forEach((item, inx) => {
      const chapterInfo = pages.find((chapter) => String(chapter.id) === String(item.i));
      nextChapters.push({
        ...chapterInfo,
        orderNo: inx + 1,
      });

      Object.keys(nextGridLayouts).forEach((breakpoint) => {
        const layoutInfo = nextGridLayouts[breakpoint].find((d) => String(d.i) === String(item.i));
        if (layoutInfo) {
          layoutInfo.x = getX(gridSetting, breakpoint, inx + 1);
          layoutInfo.y = getY(gridSetting, breakpoint, inx + 1);
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
      updatePageOrders(topicId, chapterId, afterOrders);
    }

    this.setState({
      gridLayouts: nextGridLayouts,
    });

    setPages(nextChapters);
  };

  render() {
    const {
      updatePageTitle,
      deletePage,
      pages,
      gridSetting,
      rowHeight,
      isWriter,
      margin,
      onPageClick,
      selectedId,
    } = this.props;
    const { gridLayouts } = this.state;

    return (
      <div className="chapter-card-layout-list">
        {pages !== false && pages.length > 0 && (
          <div className="chapter-list">
            <ResponsiveReactGridLayout
              onLayoutChange={this.onLayoutChange}
              className="layout"
              breakpoints={gridSetting.breakpoints}
              cols={gridSetting.cols}
              rowHeight={rowHeight}
              isResizable={false}
              // compactType="horizontal"
              // verticalCompact
              layouts={gridLayouts}
              margin={margin}
              onBreakpointChange={(newBreakpoint) => {
                this.breakpoint = newBreakpoint;
              }}
              useCSSTransforms={false}
              // layout={gridLayouts}
            >
              {pages.map((page) => {
                return (
                  <div
                    key={page.id}
                    data-grid={gridLayouts[this.breakpoint].find((d) => String(d.id) === String(page.id))}
                  >
                    <PageCard
                      className={`${page.id === selectedId ? 'selected' : ''} ${page.dirty ? 'dirty' : ''}`}
                      page={page}
                      onCardClick={(pageId) => {
                        onPageClick(pageId);
                      }}
                      onRemoveClick={(pageId) => {
                        deletePage(pageId);
                      }}
                      onChangeTitle={updatePageTitle}
                      isWriter={isWriter}
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

PageCardLayoutList.propTypes = {
  updatePageTitle: PropTypes.func,
  updatePageOrders: PropTypes.func,
  deletePage: PropTypes.func,
  pages: PropTypes.arrayOf(PropTypes.any),
  topicId: PropTypes.number,
  chapterId: PropTypes.number,
  setPages: PropTypes.func,
  gridSetting: PropTypes.objectOf(PropTypes.any),
  rowHeight: PropTypes.number,
  isWriter: PropTypes.bool,
  margin: PropTypes.arrayOf(PropTypes.number),
  onPageClick: PropTypes.func,
  selectedId: PropTypes.number,
};

export default PageCardLayoutList;
