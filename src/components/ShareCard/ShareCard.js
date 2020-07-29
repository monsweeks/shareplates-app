import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTimeAgo from 'react-time-ago';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';
import { Button, Card, CardBody } from '@/components';
import { SharePropTypes } from '@/proptypes';
import './ShareCard.scss';

class ShareCard extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { className, share, onConfigClick, onCardClick, t } = this.props;
    const lastBucket =
      share.shareTimeBuckets && share.shareTimeBuckets.length > 0
        ? share.shareTimeBuckets[share.shareTimeBuckets.length - 1]
        : {};
    const joinedAdminUser = share.shareUsers.find(
      (shareUser) => shareUser.shareRoleCode === 'ADMIN' && shareUser.status === 'ONLINE',
    );
    const totalUserCount = share.onLineUserCount + share.offLineUserCount;

    return (
      <Card className={`share-card-wrapper g-no-select ${className}`}>
        <CardBody>
          {share && share.privateYn && (
            <div className="private">
              <span className="tag">private</span>
            </div>
          )}
          <div className="open-time">
            <span className='short-icon'>
              <i className="fal fa-clock" />
            </span>
            <ReactTimeAgo date={moment(lastBucket.openDate).valueOf()} />
          </div>
          <div className="tag-info">
            <span
              data-tip={t('매니저가 참여중입니다')}
              className={`short-icon admin-join ${joinedAdminUser ? 'joined' : ''}`}
            >
              <i className="fal fa-head-side" />
            </span>
            <span
              data-tip={share.startedYn ? t('공유 진행중') : t('공유 준비중')}
              className={`short-icon status  ${share.startedYn ? 'started' : ''}`}
            >
              {share.startedYn && <i className="fal fa-play" />}
              {!share.startedYn && <i className="fal fa-pause" />}
            </span>
            <span
              data-tip={`${totalUserCount}${t('명의 사용자가 참여중입니다.')}`}
              className={`short-icon user-count-icon ${totalUserCount > 0 ? 'has-joined-user' : ''}`}
            >
              <i className="fas fa-street-view" />
            </span>
          </div>
          <div className="title">
            <div className="share-name">{share.name}</div>
            {onConfigClick && (
              <Button
                className="config-button g-circle-icon-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigClick(share.topicId, share.id);
                }}
                size="sm"
                color="white"
              >
                <i className="fal fa-cog" />
              </Button>
            )}
          </div>
          <div className="topic-name">
            <span className="g-tag">{share.topicName}</span>
          </div>
          <div className="description">
            <div className="scrollbar">
              <div className="g-attach-parent">
                <div>{share.description}</div>
              </div>
            </div>
          </div>
          <div className="bottom-buttons">
            <Button
              onClick={() => {
                onCardClick(share.id);
              }}
              size="sm"
              color="white"
            >
              <div className="icon">
                <i className="fal fa-broadcast-tower" />
              </div>
              <div className="text">{t('참여')}</div>
            </Button>
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
  share: SharePropTypes,
  t: PropTypes.func,
  className: PropTypes.string,
  onConfigClick: PropTypes.func,
  onCardClick: PropTypes.func,
};
