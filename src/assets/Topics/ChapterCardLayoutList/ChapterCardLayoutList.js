import React from 'react';
import PropTypes from 'prop-types';
import { ChapterCard, ChapterRow } from '@/assets';
import './ChapterCardLayoutList.scss';

class ChapterCardLayoutList extends React.Component {
  draggingChapterOrder = null;

  somethingMoved = false;

  constructor(props) {
    super(props);
    this.state = {
      draggingChapterId: null,
    };
  }

  onDragStart = (id, orderNo) => {
    this.draggingChapterOrder = orderNo;
    this.somethingMoved = false;
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
    if (this.somethingMoved) {
      updateChapterOrders();
    }

    this.somethingMoved = false;
  };

  onDragOver = (id, orderNo, e) => {
    e.stopPropagation();
    e.preventDefault();

    const { moveChapter } = this.props;
    const { draggingChapterId } = this.state;

    if (draggingChapterId !== id) {
      this.somethingMoved = true;
      moveChapter(draggingChapterId, id, this.draggingChapterOrder < orderNo);
      this.draggingChapterOrder = orderNo;
    }
  };

  getChapterItem = (chapter, viewType, newCard) => {
    const { updateChapterTitle, deleteChapter, isWriter, onChapterClick, createChapter } = this.props;

    if (viewType === 'card') {
      return (
        <ChapterCard
          newCard={newCard}
          chapter={chapter}
          onCardClick={(chapterId) => {
            if (newCard) {
              createChapter();
            } else {
              onChapterClick(chapterId);
            }
          }}
          onRemoveClick={(chapterId) => {
            deleteChapter(chapterId);
          }}
          onChangeTitle={updateChapterTitle}
          isWriter={isWriter}
        />
      );
    }

    return (
      <ChapterRow
        newCard={newCard}
        chapter={chapter}
        onCardClick={(chapterId) => {
          if (newCard) {
            createChapter();
          } else {
            onChapterClick(chapterId);
          }
        }}
        onRemoveClick={(chapterId) => {
          deleteChapter(chapterId);
        }}
        onChangeTitle={updateChapterTitle}
        isWriter={isWriter}
      />
    );
  };

  render() {
    const { chapters, viewType, isWriter } = this.props;
    const { draggingChapterId } = this.state;

    return (
      <div className="chapter-card-layout-list">
        {chapters !== false && chapters.length > 0 && (
          <div className={`chapter-list ${viewType}-type`}>
            {chapters.map((chapter) => {
              return (
                <div
                  key={chapter.id}
                  draggable={isWriter}
                  onDragStart={(e) => {
                    this.onDragStart(chapter.id, chapter.orderNo, e);
                  }}
                  onDragEnd={(e) => {
                    this.onDragEnd(chapter.id, e);
                  }}
                  onDragOver={(e) => {
                    this.onDragOver(chapter.id, chapter.orderNo, e);
                  }}
                  className={chapter.id === draggingChapterId ? 'dragging' : ''}
                >
                  {this.getChapterItem(chapter, viewType)}
                </div>
              );
            })}
            <div>{this.getChapterItem(null, viewType, true)}</div>
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
  createChapter: PropTypes.func,
};

export default ChapterCardLayoutList;
