import React from 'react';
import PropTypes from 'prop-types';
import { ChapterCard, ChapterRow } from '@/components';
import './ChapterCardLayoutList.scss';

class ChapterCardLayoutList extends React.Component {
  draggingChapterOrder = null;

  constructor(props) {
    super(props);
    this.state = {
      draggingChapterId: null,
    };
  }

  onDragStart = (id, orderNo) => {
    this.draggingChapterOrder = orderNo;
    this.setState({
      draggingChapterId: id,
    });
  };

  onDragEnd = () => {
    this.draggingChapterOrder = null;
    this.setState({
      draggingChapterId: null,
    });

    const { updateChapterOrders } = this.props;
    updateChapterOrders();
  };

  onDrop = (id, orderNo, e) => {
    e.stopPropagation();
    e.preventDefault();

    const { moveChapter } = this.props;
    const { draggingChapterId } = this.state;

    moveChapter(draggingChapterId, id, this.draggingChapterOrder < orderNo);
  };

  onDragOver = (id, orderNo, e) => {
    e.stopPropagation();
    e.preventDefault();

    const { moveChapter } = this.props;
    const { draggingChapterId } = this.state;

    if (draggingChapterId !== id) {
      moveChapter(draggingChapterId, id, this.draggingChapterOrder < orderNo);
      this.draggingChapterOrder = orderNo;
    }
  };

  render() {
    const { updateChapterTitle, deleteChapter, chapters, viewType, isWriter, onChapterClick } = this.props;
    const { draggingChapterId } = this.state;

    return (
      <div className="chapter-card-layout-list">
        {chapters !== false && chapters.length > 0 && (
          <div className={`chapter-list ${viewType}-type`}>
            {chapters.map((chapter) => {
              return (
                <div
                  key={chapter.id}
                  draggable={!isWriter}
                  onDragStart={(e) => {
                    this.onDragStart(chapter.id, chapter.orderNo, e);
                  }}
                  onDragEnd={(e) => {
                    this.onDragEnd(chapter.id, e);
                  }}
                  onDrop={(e) => {
                    this.onDrop(chapter.id, chapter.orderNo, e);
                  }}
                  onDragOver={(e) => {
                    this.onDragOver(chapter.id, chapter.orderNo, e);
                  }}
                  className={chapter.id === draggingChapterId ? 'dragging' : ''}
                >
                  {viewType === 'card' && (
                    <ChapterCard
                      chapter={chapter}
                      onCardClick={(chapterId) => {
                        onChapterClick(chapterId);
                      }}
                      onRemoveClick={(chapterId) => {
                        deleteChapter(chapterId);
                      }}
                      onChangeTitle={updateChapterTitle}
                      isWriter={isWriter}
                    />
                  )}
                  {viewType === 'list' && (
                    <ChapterRow
                      chapter={chapter}
                      onCardClick={(chapterId) => {
                        onChapterClick(chapterId);
                      }}
                      onRemoveClick={(chapterId) => {
                        deleteChapter(chapterId);
                      }}
                      onChangeTitle={updateChapterTitle}
                      isWriter={isWriter}
                    />
                  )}
                </div>
              );
            })}
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
  viewType: PropTypes.string,
  isWriter: PropTypes.bool,
  onChapterClick: PropTypes.func,
  moveChapter: PropTypes.func,
};

export default ChapterCardLayoutList;
