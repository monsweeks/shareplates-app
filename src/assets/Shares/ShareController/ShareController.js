import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';
import numeral from 'numeral';
import { withTranslation } from 'react-i18next';
import { Button, Card, CardBody, Pill, RadioButton, Tabs } from '@/components';
import './ShareController.scss';
import { SharePropTypes, TopicPropTypes, UserPropTypes } from '@/proptypes';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { ChatManager, ShareUserCard } from '@/assets';

const tabs = [
  {
    value: 'status',
    name: '관리',
  },
  {
    value: 'process',
    name: '진행',
  },
  {
    value: 'pointer',
    name: '포인터',
  },
  {
    value: 'function',
    name: '기능',
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
  omitEvent = false;

  constructor(props) {
    super(props);

    this.state = {
      tab: 'process',
      userChatTab: 'user',
      swipingDir: numeral,
    };
  }

  onSwiped = (e) => {
    if (this.omitEvent) {
      this.omitEvent = false;
      return;
    }

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

  onMoveSwiped = (e) => {
    const { movePage, sendMoveScroll } = this.props;

    this.omitEvent = true;
    if (e.dir === 'Right') {
      movePage(true);
    }

    if (e.dir === 'Left') {
      movePage(false);
    }

    if (e.dir === 'Up') {
      sendMoveScroll('up');
    }

    if (e.dir === 'Down') {
      sendMoveScroll('down');
    }

    this.setState({
      swipingDir: null,
    });
  };

  onMoveSwiping = (e) => {
    const { swipingDir } = this.state;
    if (swipingDir !== e.dir) {
      this.setState({
        swipingDir: e.dir,
      });
    }
  };

  getCurrentPageSequence = (chapterPageList, chaterId, pageId) => {
    let seq = 0;
    if (chapterPageList) {
      for (let i = 0; i < chapterPageList.length; i += 1) {
        const chapter = chapterPageList[i];
        if (chapter.id === chaterId) {
          if (chapter.pages) {
            seq += 1 + chapter.pages.findIndex((page) => page.id === pageId);
          }
          break;
        }
        seq += chapter.pages.length;
      }
    }

    return seq;
  };

  render() {
    const { className, t } = this.props;
    const {
      topic,
      share,
      users,
      isAdmin,
      messages,
      user,
      chapterPageList,
      currentChapterId,
      currentPageId,
      projectorScrollInfo,
    } = this.props;

    const {
      startShare,
      closeShare,
      exitShare,
      stopShare,
      sendReadyChat,
      banUser,
      kickOutUser,
      allowUser,
      movePage,
      sendMoveScroll,
    } = this.props;
    const { startedYn } = share;

    const { tab, userChatTab, swipingDir } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);

    const totalPageCount = topic.pageCount;
    const currentSeq = this.getCurrentPageSequence(chapterPageList, currentChapterId, currentPageId);

    const currentChapter = chapterPageList.find((chapter) => chapter.id === currentChapterId);
    const currentPage = currentChapter.pages.find((page) => page.id === currentPageId);

    const noBannedUsers = users.filter((u) => !u.banYn);
    const onlineUserCount = noBannedUsers.filter((u) => u.status === 'ONLINE').length;
    const offlineUserCount = noBannedUsers.filter((u) => u.status === 'OFFLINE').length;
    const totalUserCount = noBannedUsers.length;
    const focusUserCount = noBannedUsers.filter((u) => u.focusYn).length;

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
        <Swipeable className="controller-content swipeable" onSwiped={this.onSwiped} delta={50}>
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
                    <Card className="border-0 rounded-sm mt-2 flex-grow-1">
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
              <div>
                <div className="scrollbar">
                  <div className="process-layout">
                    <Card className="border-0 rounded-sm flex-grow-0">
                      <CardBody>
                        <div className="process-percentage">
                          <div className="process-bg">
                            <div className="label">{t('진행율')}</div>
                            <div className="percentage">{numeral(currentSeq / totalPageCount).format('0.00%')}</div>
                            <div className="percentage-data">
                              ({currentSeq}/{totalPageCount})
                            </div>
                            <div
                              className="bar"
                              style={{
                                height: `${(currentSeq / totalPageCount) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="process-bg">
                            <div className="label">{t('온라인')}</div>
                            <div className="percentage">
                              {numeral(onlineUserCount / totalUserCount).format('0.00%')}
                            </div>
                            <div className="percentage-data">
                              ({onlineUserCount}/{totalUserCount})
                            </div>
                            <div
                              className="bar"
                              style={{
                                height: `${(onlineUserCount / totalUserCount) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="process-bg">
                            <div className="label">{t('집중도')}</div>
                            <div className="percentage">{numeral(focusUserCount / totalUserCount).format('0.00%')}</div>
                            <div className="percentage-data">
                              ({focusUserCount}/{totalUserCount})
                            </div>
                            <div
                              className="bar"
                              style={{
                                height: `${(focusUserCount / totalUserCount) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="border-0 rounded-sm flex-grow-0 mt-2">
                      <CardBody>
                        <div className="line py-0">
                          <div className="label chapter-page-label">
                            <span>{t('현재 위치')}</span>
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="value chapter-page-title">
                            <div>
                              <div>{currentChapter.title}</div>
                              <div>
                                <i className="fal fa-chevron-right mx-2" />{currentPage.title}
                              </div>
                              <div className="popup-button">
                                <span>
                                  <i className="fal fa-window" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="line py-0">
                          <div className="label chapter-page-label">
                            <span>{t('챕터')}</span>
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="value text-right">
                            <div className="chapter-list">
                              {chapterPageList.map((chapter) => {
                                return (
                                  <div
                                    key={chapter.id}
                                    className={`${currentChapterId === chapter.id ? 'selected' : ''}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="line py-0">
                          <div className="label chapter-page-label">
                            <span>{t('페이지')}</span>
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="value text-right">
                            <div className="page-list">
                              {currentChapter &&
                                currentChapter.pages.map((page) => {
                                  return (
                                    <div key={page.id} className={`${currentPageId === page.id ? 'selected' : ''}`} />
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="border-0 rounded-sm flex-grow-1 mt-2">
                      <CardBody className="h-100 d-flex flex-column p-0">
                        <Swipeable
                          className="move-swipeable"
                          onSwiped={this.onMoveSwiped}
                          onSwiping={this.onMoveSwiping}
                          delta={50}
                        >
                          <Button
                            color="transparent g-no-focus"
                            onClick={() => {
                              movePage(false);
                            }}
                          >
                            <i className={`${swipingDir === 'Left' ? 'swiping' : ''} fal fa-chevron-left`} />
                          </Button>
                          <div className="scroll-controller">
                            <Button
                              className="flex-grow-0 g-no-focus"
                              color="transparent"
                              onClick={() => {
                                sendMoveScroll('up');
                              }}
                            >
                              <i className={`${swipingDir === 'Up' ? 'swiping' : ''} fal fa-chevron-up`} />
                            </Button>
                            <div>
                              <div>
                                <div className="rounded">
                                  {projectorScrollInfo.windowHeight && projectorScrollInfo.contentViewerHeight && (
                                    <div
                                      className="window"
                                      style={{
                                        height: `${(projectorScrollInfo.windowHeight /
                                          projectorScrollInfo.contentViewerHeight) *
                                          100}%`,
                                        top: `${(projectorScrollInfo.scrollTop /
                                          projectorScrollInfo.contentViewerHeight) *
                                          100}%`,
                                      }}
                                    >
                                      <div>
                                        <span className="g-tag bg-primary text-white">스크린</span>
                                      </div>
                                    </div>
                                  )}
                                  {!(projectorScrollInfo.windowHeight && projectorScrollInfo.contentViewerHeight) && (
                                    <div className="h-100 w-100 d-flex">
                                      <div className="align-self-center w-100 text-center ">
                                        {t('연결된 프로젝터 타입이 없습니다')}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              className="flex-grow-0 g-no-focus"
                              color="transparent"
                              onClick={() => {
                                sendMoveScroll('down');
                              }}
                            >
                              <i className={`${swipingDir === 'Down' ? 'swiping' : ''} fal fa-chevron-down`} />
                            </Button>
                          </div>
                          <Button
                            color="transparent g-no-focus"
                            onClick={() => {
                              movePage(true);
                            }}
                          >
                            <i className={`${swipingDir === 'Right' ? 'swiping' : ''} fal fa-chevron-right`} />
                          </Button>
                        </Swipeable>
                      </CardBody>
                    </Card>
                  </div>
                </div>
                <div className="bottom-fixed-menu">
                  {isAdmin && (
                    <>
                      <Button
                        className="g-no-focus"
                        color="transparent"
                        onClick={() => {
                          movePage(false);
                        }}
                      >
                        <i className="fal fa-chevron-left" />
                        <div>
                          <span>이전 페이지</span>
                        </div>
                        <div className="separator">
                          <div />
                        </div>
                      </Button>
                      <Button
                        className="g-no-focus"
                        color="transparent"
                        onClick={() => {
                          movePage(true);
                        }}
                      >
                        <i className="fal fa-chevron-right" />
                        <div>
                          <span>다음 페이지</span>
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
  topic: TopicPropTypes,
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
  chapterPageList: PropTypes.arrayOf(PropTypes.any),
  currentChapterId: PropTypes.number,
  currentPageId: PropTypes.number,
  movePage: PropTypes.func,
  projectorScrollInfo: PropTypes.shape({
    windowHeight: PropTypes.number,
    contentViewerHeight: PropTypes.number,
    scrollTop: PropTypes.number,
  }),
  sendMoveScroll: PropTypes.func,
};

export default withTranslation()(ShareController);
