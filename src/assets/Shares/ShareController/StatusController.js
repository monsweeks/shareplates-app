import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Card, CardBody, Tabs } from '@/components';
import { SharePropTypes, UserPropTypes } from '@/proptypes';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { ChatManager, ShareUserCard } from '@/assets';
import './StatusController.scss';

const userChatTabs = [
  {
    value: 'user',
    name: '사용자',
  },
  {
    value: 'chat',
    name: '메세지',
  },
];

class StatusController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      userChatTab: 'user',
    };
  }

  render() {
    const { className, t } = this.props;
    const { share, users, isAdmin, messages, user } = this.props;

    const { startShare, closeShare, exitShare, stopShare, sendReadyChat, banUser, kickOutUser, allowUser } = this.props;
    const { startedYn } = share;

    const { userChatTab } = this.state;

    const noBannedUsers = users.filter((u) => !u.banYn);
    const onlineUserCount = noBannedUsers.filter((u) => u.status === 'ONLINE').length;
    const offlineUserCount = noBannedUsers.filter((u) => u.status === 'OFFLINE').length;

    return (
      <div className={`${className} status-controller-wrapper`}>
        <div className="flex-grow-1 position-relative">
          <div className="g-attach-parent status-layout d-flex flex-column">
            <Card className="border-0 flex-grow-0 mt-4 mx-0 mb-2">
              <CardBody className="p-0">
                <div className="progress-status">
                  <div className="left">
                    <div>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => {
                          dialog.setConfirm(
                            MESSAGE_CATEGORY.WARNING,
                            t('공유 종료 확인'),
                            '공유가 종료되고, 참여 중인 모든 사용자가 메인화면으로 이동합니다.',
                            () => {
                              closeShare();
                            },
                          );
                        }}
                      >
                        공유 종료
                      </Button>
                    </div>
                  </div>
                  <div className="center">
                    <div className={`${share.startedYn ? 'started' : ''} icon`}>
                      {share.startedYn && <i className="fas fa-wifi" />}
                      {!share.startedYn && <i className="fas fa-wifi-2" />}
                    </div>
                    <div className="status-text">
                      {share.startedYn && <span>진행중</span>}
                      {!share.startedYn && <span>대기중</span>}
                    </div>
                    <div className="user-count-status">
                      <div className="user-icon">
                        <i className="fal fa-user-astronaut" />
                      </div>
                      <div className="total-count">
                        <span>{onlineUserCount + offlineUserCount}</span>
                      </div>
                      <div>
                        <span className="online-user-count">{onlineUserCount}</span> /
                        <span className="offline-user-count">{offlineUserCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div>
                      {share.startedYn && (
                        <Button color="yellow" size="sm" onClick={stopShare}>
                          일시 정지
                        </Button>
                      )}
                      {!share.startedYn && (
                        <Button color="yellow" size="sm" onClick={startShare}>
                          공유 시작
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="border-0 flex-grow-1 mx-4">
              <CardBody className="h-100 d-flex flex-column p-0">
                <Tabs
                  className="tabs border-0 pt-0  flex-grow-0"
                  left
                  tabs={userChatTabs}
                  tab={userChatTab}
                  onChange={(v) => {
                    this.setState({
                      userChatTab: v,
                    });
                  }}
                  buttonStyle
                />
                <div className="user-chat-manager-content flex-grow-1 position-relative">
                  {userChatTab === 'user' && (
                    <div className="user-list scrollbar">
                      {users.map((u) => {
                        return (
                          <ShareUserCard
                            key={u.id}
                            userControl={isAdmin}
                            className="user-card"
                            currentUser={user}
                            user={u}
                            banUser={banUser}
                            allowUser={allowUser}
                            kickOutUser={kickOutUser}
                          />
                        );
                      })}
                    </div>
                  )}
                  {userChatTab === 'chat' && (
                    <div className="chat-manager">
                      <ChatManager
                        messages={messages}
                        user={user}
                        sendReadyChat={sendReadyChat}
                        boxShadow={false}
                        showTitle={false}
                        flatChatControl
                      />
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="flex-grow-0 flex-row bg-black d-none">
          <Button className="g-no-focus flex-fill p-3 text-warning" color="transparent" onClick={exitShare}>
            <i className="fal fa-sign-out-alt" />
            <div>
              <span>나가기</span>
            </div>
          </Button>
          {isAdmin && (
            <>
              <Button
                className="g-no-focus flex-fill p-3 text-danger"
                color="transparent"
                onClick={() => {
                  dialog.setConfirm(
                    MESSAGE_CATEGORY.WARNING,
                    t('공유 종료 확인'),
                    '공유가 종료되고, 참여 중인 모든 사용자가 메인화면으로 이동합니다.',
                    () => {
                      closeShare();
                    },
                  );
                }}
              >
                <i className="fas fa-stop text-danger" />
                <div>
                  <span>종료</span>
                </div>
              </Button>
              <Button
                className={`g-no-focus flex-fill text-white p-3 ${!startedYn ? '' : 'text-warning'}`}
                disabled={!startedYn}
                color="transparent"
                onClick={stopShare}
              >
                <i className={`fas fa-pause ${!startedYn ? '' : 'text-warning'}`} />
                <div>
                  <span>정지</span>
                </div>
              </Button>
              <Button
                className="g-no-focus flex-fill text-white p-3"
                disabled={startedYn}
                color="transparent"
                onClick={startShare}
              >
                <i className={`fas fa-play ${startedYn ? '' : 'text-success'}`} />
                <div>
                  <span>시작</span>
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }
}

StatusController.defaultProps = {
  className: '',
};

StatusController.propTypes = {
  className: PropTypes.string,
  share: SharePropTypes,
  users: PropTypes.arrayOf(UserPropTypes),
  isAdmin: PropTypes.bool,
  startShare: PropTypes.func,
  closeShare: PropTypes.func,
  exitShare: PropTypes.func,
  stopShare: PropTypes.func,
  t: PropTypes.func,
  messages: PropTypes.arrayOf(PropTypes.any),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  sendReadyChat: PropTypes.func,
  banUser: PropTypes.func,
  kickOutUser: PropTypes.func,
  allowUser: PropTypes.func,
  projectorScrollInfo: PropTypes.shape({
    windowHeight: PropTypes.number,
    contentViewerHeight: PropTypes.number,
    scrollTop: PropTypes.number,
  }),
  options: PropTypes.shape({
    hideShareNavigator: PropTypes.bool,
    fullScreen: PropTypes.bool,
  }),
};

export default withTranslation()(StatusController);
