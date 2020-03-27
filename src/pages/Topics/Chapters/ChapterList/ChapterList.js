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
  breakpoints: { lg: 801, md: 800 },
  cols: { lg: 6, md: 6 },
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
      this.setState({
        chapters: data.chapters || [],
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
    console.log(layout);
    console.log(layouts);

    layout.sort((a, b) => {
      return a.y * GRID_SETTINGS.cols[this.breakpoint] + a.x - (b.y * GRID_SETTINGS.cols[this.breakpoint] + b.x);
    });

    const { chapters } = this.state;
    const next = [];
    const nextGridLayouts = { ...layouts };



    layout.forEach((item, inx) => {
      const info = chapters.find((chapter) => String(chapter.id) === String(item.i));
      next.push({
        ...info,
        orderNo: inx + 1,
      });

      const l = nextGridLayouts[this.breakpoint].find((d) => String(d.i) === String(item.i));
      console.log(nextGridLayouts[this.breakpoint]);
      if (l) {
        l.x = this.getX(inx + 1);
        l.y = this.getY(inx + 1);
      }

    });


      this.setState({
        chapters: next,
        gridLayouts: nextGridLayouts,
      });



    console.log(nextGridLayouts);
    console.log(next);
  };

  getX = (orderNo) => {
    const next = (orderNo % GRID_SETTINGS.cols[this.breakpoint]) - 1;
    if (next < 0) {
      return GRID_SETTINGS.cols[this.breakpoint] - 1;
    }
    return next;
  };

  getY = (orderNo) => {
    return Math.floor((orderNo - 1) / GRID_SETTINGS.cols[this.breakpoint]);
  };

  render() {
    const { chapters, gridLayouts } = this.state;

    console.log(gridLayouts);

    return (
      <FullLayout className="chapter-list-wrapper">
        <div className="chapter-list pt-4">
          <div>
            <Button
              onClick={() => {
                this.createChapter();
              }}
            >
              추가
            </Button>
          </div>
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
            onBreakpointChange={(newBreakpoint, newCols) => {
              console.log(newBreakpoint, newCols);
            }}
            // layout={gridLayouts}
          >
            {chapters.map((chapter) => {
              console.log(chapter.orderNo, this.getX(chapter.orderNo), this.getY(chapter.orderNo));
              return (
                <div
                  key={chapter.id}
                  data-grid={{
                    i: String(chapter.id),
                    w: 1,
                    h: 1,
                    x: this.getX(chapter.orderNo),
                    y: this.getY(chapter.orderNo),
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
