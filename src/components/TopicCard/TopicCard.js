import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, ObjectImage } from '@/components';
import './TopicCard.scss';
import CircleIcon from '@/components/CircleIcon/CircleIcon';

class TopicCard extends React.PureComponent {
  render() {
    const { className, topic, onCardClick, onConfigClick, newCard } = this.props;

    return (
      <Card
        className={`topic-card-wrapper g-no-select ${className}`}
        onClick={() => {
          onCardClick(topic ? topic.id : null);
        }}
      >
        <CardBody>
          {!newCard && (
            <span className="config-button">
              <CircleIcon
                color='white'
                icon={<i className="fal fa-info-circle" />}
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigClick(topic ? topic.id : null);
                }}
              />
            </span>
          )}
          {topic && topic.privateYn && <span className="private">private</span>}
          <div className="topic-card-content">
            {newCard && (
              <>
                <div className="new-topic-content">
                  <div className="new-topic-icon">
                    <i className="fal fa-plus" />
                  </div>
                  <div className="text">새로운 토픽</div>
                </div>
              </>
            )}
            {!newCard && (
              <>
                <div className="topic-title">{topic.name}</div>
                <div className="topic-summary">{topic.summary}</div>
                <div className="topic-description">
                  <div className="icon">
                    <div>
                      <ObjectImage circle size="md" index={topic.iconIndex} />
                    </div>
                  </div>
                  <div className="counts">
                    <div>
                      <div>
                        <div className="level-icon">
                          <i className="fal fa-book" />
                        </div>
                        <div className="level-count">{topic.chapterCount}</div>
                        <div className="tag">CHAPTERS</div>
                      </div>
                      <div>
                        <div className="level-icon">
                          <i className="fal fa-clipboard" />
                        </div>
                        <div className="level-count">{topic.pageCount}</div>
                        <div className="tag">PAGES</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default TopicCard;

TopicCard.defaultProps = {
  className: '',
  newCard: false,
};

TopicCard.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    iconIndex: PropTypes.number,
    summary: PropTypes.string,
    privateYn: PropTypes.bool,
    chapterCount: PropTypes.number,
    pageCount: PropTypes.number,
  }),
  className: PropTypes.string,
  onCardClick: PropTypes.func,
  onConfigClick: PropTypes.func,
  newCard: PropTypes.bool,
};
