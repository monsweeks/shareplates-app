import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Card, CardBody } from '@/components';
import './TopicCard.scss';
import { TopicPropTypes } from '@/proptypes';

class TopicCard extends React.PureComponent {
  render() {
    const { className, topic, newCard, t } = this.props;
    const { onCardClick, onInfoClick, onContentClick, onShareClick, isAdmin } = this.props;

    return (
      <Card
        className={`topic-card-wrapper g-no-select ${className} ${onCardClick ? 'pointer-cursor' : ''}`}
        onClick={() => {
          if (onCardClick) {
            onCardClick();
          }
        }}
      >
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
                    className={`button ${(topic.isMember || isAdmin) ? 'enable' : 'disable'}`}
                    onClick={() => {
                      if ((topic.isMember || isAdmin)) {
                        onShareClick(topic ? topic.id : null);
                      }
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
                    className="enable button"
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
                    className="enable button"
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
  isAdmin: false,
};

TopicCard.propTypes = {
  topic: TopicPropTypes,
  t: PropTypes.func,
  className: PropTypes.string,
  onInfoClick: PropTypes.func,
  onContentClick: PropTypes.func,
  onShareClick: PropTypes.func,
  onCardClick: PropTypes.func,
  newCard: PropTypes.bool,
  isAdmin : PropTypes.bool,
};
