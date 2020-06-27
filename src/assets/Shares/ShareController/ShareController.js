import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';
import { withTranslation } from 'react-i18next';
import { Button, Card, CardBody, Pill, RadioButton, Tabs } from '@/components';
import './ShareController.scss';
import { SharePropTypes, UserPropTypes } from '@/proptypes';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { ChatManager, ShareUserCard } from '@/assets';

const tabs = [
  {
    value: 'status',
    name: '진행 관리',
  },
  {
    value: 'pointer',
    name: '포인터',
  },
  {
    value: 'process',
    name: '진행',
  },
  {
    value: 'users',
    name: '사용자',
  },
];

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

class ShareController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'status',
      userChatTab: 'user',
    };
  }

  onSwiped = (e) => {
    const { tab } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);
    if (e.dir === 'Right') {
      if (index > 0) {
        this.setState({
          tab: tabs[index - 1].value,
        });
      } else {
        this.setState({
          tab: tabs[tabs.length - 1].value,
        });
      }
    }

    if (e.dir === 'Left') {
      if (index < tabs.length - 1) {
        this.setState({
          tab: tabs[index + 1].value,
        });
      } else {
        this.setState({
          tab: tabs[0].value,
        });
      }
    }
  };

  render() {
    const { className, t } = this.props;
    const { share, users, isAdmin, messages, user } = this.props;
    const { startShare, closeShare, exitShare, stopShare, sendReadyChat, banUser, kickOutUser, allowUser } = this.props;
    const { startedYn } = share;

    const { tab, userChatTab } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);

    return (
      <div className={`share-controller-wrapper ${className}`}>
        <div className="top pl-2">
          <div className="marker">
            <div
              style={{
                left: `calc(((100% - 1.5rem) / 4) * ${index} + (0.5rem * ${index})`,
              }}
            />
          </div>
          <Tabs
            className="tabs border-0"
            left
            tabs={tabs}
            tab={tab}
            onChange={(v) => {
              this.setState({
                tab: v,
              });
            }}
            buttonStyle
            tabColor="transparent"
          />
        </div>
        <Swipeable className="controller-content swipeable" onSwiped={this.onSwiped}>
          <div>
            <div
              className="content-layout"
              style={{
                left: `-${index * 100}%`,
              }}
            >
              <div>
                <div className="scrollbar">
                  <div className="status-layout">
                    <Card className="border-0 rounded-sm flex-grow-0">
                      <CardBody className="py-0">
                        <div className="line">
                          <div className="label">{t('공유 상태')}</div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="value text-right">
                            <RadioButton
                              outline
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
                      </CardBody>
                    </Card>
                    <Card className="border-0 rounded-sm mt-2  flex-grow-0">
                      <CardBody className="py-0">
                        <div className="line">
                          <div className="label">현재 참여인원</div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="value text-right">
                            <Pill
                              className="mr-2"
                              label="ONLINE"
                              value={users.filter((u) => u.status === 'ONLINE').length}
                            />
                            <Pill
                              label="OFFLINE"
                              labelClassName="bg-danger"
                              value={users.filter((u) => u.status === 'OFFLINE').length}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="border-0 rounded-sm mt-2 flex-grow-1">
                      <CardBody className="h-100 d-flex flex-column">
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
                            <ChatManager
                              messages={messages}
                              user={user}
                              sendReadyChat={sendReadyChat}
                              boxShadow={false}
                              showTitle={false}
                              flatChatControl
                            />
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
                <div className="bottom-fixed-menu">
                  <Button color="transparent" onClick={exitShare}>
                    <i className="fal fa-sign-out-alt text-warning" />
                    <div>
                      <span>나가기</span>
                    </div>
                  </Button>
                  {isAdmin && (
                    <>
                      <Button
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
                        <div className="separator">
                          <div />
                        </div>
                      </Button>
                      <Button disabled={!startedYn} color="transparent" onClick={stopShare}>
                        <i className={`fas fa-pause ${!startedYn ? '' : 'text-warning'}`} />
                        <div>
                          <span>정지</span>
                        </div>
                        <div className="separator">
                          <div />
                        </div>
                      </Button>
                      <Button disabled={startedYn} color="transparent" onClick={startShare}>
                        <i className={`fas fa-play ${startedYn ? '' : 'text-success'}`} />
                        <div>
                          <span>시작</span>
                        </div>
                        <div className="separator">
                          <div />
                        </div>
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div>포인터</div>
              <div>프로세스</div>
              <div>사용자</div>
            </div>
          </div>
        </Swipeable>
      </div>
    );
  }
}

ShareController.defaultProps = {
  className: '',
};

ShareController.propTypes = {
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
};

export default withTranslation()(ShareController);
