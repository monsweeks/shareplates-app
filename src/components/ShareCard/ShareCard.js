import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTimeAgo from 'react-time-ago';
import moment from 'moment';
import { Button, Card, CardBody, UserIcon } from '@/components';
import './ShareCard.scss';

const tabs = ['main', 'admin', 'current'];

class ShareCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'main',
    };
  }

  render() {
    const { className, share, onConfigClick, onCardClick, t } = this.props;
    const { tab } = this.state;

    return (
      <Card className={`share-card-wrapper g-no-select ${className}`}>
        <CardBody>
          {share && share.privateYn && (
            <div className="private">
              <span className="tag">private</span>
            </div>
          )}
          <span className="tag status">{share.startedYn ? t('진행중') : t('대기중')}</span>
          <div className="title">
            <div className="share-name">{share.name}</div>
          </div>
          <div className="slide-content">
            <div
              className="slide-content-viewer"
              style={{
                left: `${tabs.findIndex((key) => key === tab) * -100}%`,
              }}
            >
              <div className="main">
                <div>
                  <div>
                    <div className="current-count">
                      <div className="count">
                        {share.onLineUserCount} / {share.onLineUserCount + share.offLineUserCount} {t('명')}
                      </div>
                      <div className="name">{t('참여중')}</div>
                    </div>
                    <div className="open-time">
                      <ReactTimeAgo date={moment(share.lastOpenDate).valueOf()} /> 열림
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin">
                <div className="admin-user">
                  <div className="icon">
                    <div>{share.adminUserInfo && <UserIcon info={share.adminUserInfo} />}</div>
                  </div>
                  <div className="info">
                    <div className="label">어드민</div>
                    <div className="name">{share.adminUserName}</div>
                    <div className="email">{share.adminUserEmail}</div>
                  </div>
                </div>
              </div>
              <div className="current">
                <div>
                  <div>
                    <div className="topic">{share.topicName}</div>
                    <div className="value">
                      {share.currentChapterTitle} / {share.currentPageTitle}
                    </div>
                    <div className="label">진행중</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="slide-buttons">
              {tabs.map((key) => {
                return (
                  <Button
                    key={key}
                    color="gray"
                    className={`${tab === key ? 'selected' : ''}`}
                    onClick={() => {
                      this.setState({
                        tab: key,
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="bottom-buttons">
            <Button
              onClick={() => {
                onCardClick(share.id);
              }}
              size="sm"
              color="white"
              outline
            >
              참여
            </Button>
            {onConfigClick && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfigClick(share.topicId, share.id);
                }}
                size="sm"
                color="white"
                outline
              >
                관리
              </Button>
            )}
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
    onLineUserCount: PropTypes.number,
    offLineUserCount: PropTypes.number,
  }),
  t: PropTypes.func,
  className: PropTypes.string,
  onConfigClick: PropTypes.func,
  onCardClick: PropTypes.func,
};
