import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, ObjectImage } from '@/components';
import './TopicCard.scss';

class TopicCard extends React.PureComponent {
  render() {
    const { className, topic, onInfoClick, onContentClick, onShareClick, newCard, t } = this.props;

    return (
      <Card className={`topic-card-wrapper g-no-select ${className}`}>
        <CardBody>
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
                <div className="topic-summary">
                  <div>{topic.summary}</div>
                </div>
                <div className="topic-card-buttons">
                  <div
                    className="button"
                    onClick={() => {
                      onShareClick(topic ? topic.id : null);
                    }}
                  >
                    <div className="icon">
                      <i className="fal fa-broadcast-tower" />
                    </div>
                    <div className="text">{t('공유')}</div>
                  </div>
                  <div className="separator">
                    <div />
                  </div>
                  <div
                    className="button"
                    onClick={() => {
                      onContentClick(topic ? topic.id : null);
                    }}
                  >
                    <div className="icon">
                      <i className="fal fa-books" />
                    </div>
                    <div className="text">{t('컨텐츠')}</div>
                  </div>
                  <div className="separator">
                    <div />
                  </div>
                  <div
                    className="button"
                    onClick={() => {
                      onInfoClick(topic ? topic.id : null);
                    }}
                  >
                    <div className="icon">
                      <i className="fal fa-info-circle" />
                    </div>
                    <div className="text">{t('토픽 정보')}</div>
                  </div>
                </div>
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

export default withTranslation()(TopicCard);

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
  t: PropTypes.func,
  className: PropTypes.string,
  onInfoClick: PropTypes.func,
  onContentClick: PropTypes.func,
  onShareClick: PropTypes.func,
  newCard: PropTypes.bool,
};
