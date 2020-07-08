import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Card, CardBody, Pill, RadioButton, Tabs } from '@/components';
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
          <div className="g-attach-parent status-layout bg-gray-300 py-2 d-flex flex-column">
            <Card className="border-0 flex-grow-0">
              <CardBody>
                <div className="line py-0">
                  <div className="label">{t('공유 상태')}</div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="value text-right">
                    <RadioButton
                      size="sm"
                      items={[
                        {
                          key: false,
                          value: '정지',
                        },
                        {
                          key: true,
                          value: '시작됨',
                        },
                      ]}
                      value={share.startedYn}
                      onClick={(value) => {
                        if (value !== share.startedYn) {
                          if (value) {
                            startShare();
                          } else {
                            stopShare();
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="line pb-0">
                  <div className="label">현재 참여인원</div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="value text-right">
                    <Pill className="mr-2" label="ONLINE" value={onlineUserCount} />
                    <Pill label="OFFLINE" labelClassName="bg-danger" value={offlineUserCount} />
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="border-0 mt-2 flex-grow-1">
              <CardBody className="h-100 d-flex flex-column p-2">
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
                            className="user-card m-0"
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
        <div className="bottom-fixed-menu flex-grow-0 d-flex flex-row bg-black">
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
