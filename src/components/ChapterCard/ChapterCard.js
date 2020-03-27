import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from '@/components';
import CircleIcon from '@/components/CircleIcon/CircleIcon';
import './ChapterCard.scss';

class ChapterCard extends React.PureComponent {
  stopProgation = (e) => {
    e.stopPropagation();
  };

  render() {
    const { className, chapter, onCardClick, onRemoveClick, newCard } = this.props;

    return (
      <Card className={`chapter-card-wrapper g-no-select ${className}`}>
        {!newCard && (
          <CardHeader className="p-1 text-right bg-white">
            <span className="remove-button">
              <CircleIcon
                icon={<i className="fal fa-times" />}
                color="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveClick(chapter ? chapter.id : null);
                }}
              />
            </span>
          </CardHeader>
        )}
        <CardBody
          onTouchStart={this.stopProgation}
          onMouseDown={this.stopProgation}
          onClick={() => {
            if (onCardClick) {
              onCardClick(chapter ? chapter.id : null);
            }
          }}
          className="p-0"
        >
          <div className="chapter-card-content">
            {newCard && (
              <>
                <div className="new-chapter-content">
                  <div className="text-center">새 챕터 추가</div>
                  <div className="new-chapter-icon">
                    <i className="fal fa-plus" />
                  </div>
                </div>
              </>
            )}
            {!newCard && (
              <>
                <div className="chapter-id">{chapter.id}</div>
                <div className="chapter-order">{chapter.orderNo}</div>
                <div className="chapter-title">{chapter.title}</div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default ChapterCard;

ChapterCard.defaultProps = {
  className: '',
  newCard: false,
};

ChapterCard.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    orderNo: PropTypes.number,
  }),
  className: PropTypes.string,
  onCardClick: PropTypes.func,
  onRemoveClick: PropTypes.func,
  newCard: PropTypes.bool,
};
