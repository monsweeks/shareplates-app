import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTimeAgo from 'react-time-ago';
import moment from 'moment';
import { Card, CardBody, UserIcon } from '@/components';
import './ShareCard.scss';

class ShareCard extends React.PureComponent {
  render() {
    const { className, share, onConfigClick, onCardClick, t } = this.props;

    return (
      <Card
        className={`share-card-wrapper g-no-select ${className}`}
        onClick={() => {
          onCardClick(share.id, share.accessCode);
        }}
      >
        <CardBody>
          {share && share.privateYn && <span className="private">private</span>}
          <div className="share-card-content">
            <div className="share-topic-name">
              <span className="tag">{t('TOPIC')}</span>
              <span className="topic-name">{share.topicName}</span>
            </div>
            {onConfigClick && (
              <span
                className="config-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigClick(share.topicId, share.id);
                }}
              >
                <i className="fal fa-cog" />
              </span>
            )}
            <div className="share-name">{share.name}</div>
            <div className="status">
              <span>{share.startedYn ? t('ON AIR') : t('READY')}</span>
            </div>
            <div className="share-info">
              <div className="admin-user">
                <div className="info">{share.adminUserInfo && <UserIcon info={share.adminUserInfo} />}</div>
                <div className="name">{share.adminUserName}</div>
                <div className="email">{share.adminUserEmail}</div>
                <div className="separator" />
              </div>
              <div className="current-info">
                <div className="chapter-name">
                  <div className="tag">
                    <span>CHAPTER</span>
                  </div>
                  <div className="name">
                    <i className="fal fa-book" /> {share.currentChapterTitle}
                  </div>
                </div>
                <div className="page-name">
                  <div className="tag">
                    <span>PAGE</span>
                  </div>
                  <div className="name">
                    <i className="fal fa-clipboard" /> {share.currentPageTitle}
                  </div>
                </div>
              </div>
            </div>
            <div className="open-time">
              <ReactTimeAgo date={moment(share.lastOpenDate).valueOf()} />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default withTranslation()(ShareCard);

ShareCard.defaultProps = {
  className: '',
};

ShareCard.propTypes = {
  share: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    privateYn: PropTypes.bool,
    currentChapterTitle: PropTypes.string,
    currentPageTitle: PropTypes.string,
    lastOpenDate: PropTypes.string,
    topicId: PropTypes.number,
    topicName: PropTypes.string,
    adminUserEmail: PropTypes.string,
    adminUserName: PropTypes.string,
    adminUserInfo: PropTypes.shape({
      icon: PropTypes.shape({
        type: PropTypes.string,
        data: PropTypes.objectOf(PropTypes.any),
      }),
    }),
    startedYn: PropTypes.bool,
    accessCode: PropTypes.string,
  }),
  t: PropTypes.func,
  className: PropTypes.string,
  onConfigClick: PropTypes.func,
  onCardClick: PropTypes.func,
};
