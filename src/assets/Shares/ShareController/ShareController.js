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
    name: '진행 관리',
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
    const { movePage } = this.props;

    this.omitEvent = true;
    if (e.dir === 'Left') {
      movePage(true);
    }

    if (e.dir === 'Right') {
      movePage(false);
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
    } = this.props;
    const { startedYn } = share;

    const { tab, userChatTab, swipingDir } = this.state;
    const index = tabs.findIndex((d) => d.value === tab);

    console.log(topic);
    console.log(share);
    console.log(chapterPageList);
    console.log(currentChapterId, currentPageId);

    const totalPageCount = topic.pageCount;
    const currentSeq = this.getCurrentPageSequence(chapterPageList, currentChapterId, currentPageId);

    const currentChapter = chapterPageList.find((chapter) => chapter.id === currentChapterId);
    const currentPage = currentChapter.pages.find((page) => page.id === currentPageId);

    console.log(currentSeq / totalPageCount);

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
              <div>
                <div className="scrollbar">
                  <div className="process-layout">
                    <Card className="border-0 rounded-sm flex-grow-0">
                      <CardBody className="py-0">
                        <div className="line">
                          <div className="label text-left">{t('진행율')}</div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="value text-right position-relative">
                            <div className="bar">
                              <div
                                style={{
                                  width: `${(currentSeq / totalPageCount) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="position-relative px-2">
                              {numeral(currentSeq / totalPageCount).format('0.00%')}
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="border-0 rounded-sm flex-grow-0 mt-2">
                      <CardBody>
                        <div>
                          <div className="label">{t('집중도')}</div>
                          <h3 className="text-center m-0">95%</h3>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="border-0 rounded-sm flex-grow-0 mt-2">
                      <CardBody>
                        <div className="line pb-0">
                          <div className="label">{t('현재 챕터')}</div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="value px-2">{currentChapter.title}</div>
                        </div>
                        <div className="chapter-list">
                          {chapterPageList.map((chapter) => {
                            return <div className={`${currentChapterId === chapter.id ? 'selected' : ''}`} />;
                          })}
                        </div>
                        <div className="line pb-0">
                          <div className="label">{t('현재 페이지')}</div>
                          <div className="separator">
                            <div />
                          </div>
                          <div className="value px-2">{currentPage.title}</div>
                        </div>
                        <div className="page-list">
                          {currentChapter &&
                            currentChapter.pages.map((page) => {
                              return <div className={`${currentPageId === page.id ? 'selected' : ''}`} />;
                            })}
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="border-0 rounded-sm flex-grow-1 mt-2">
                      <CardBody className="h-100 d-flex flex-column p-0">
                        <Swipeable
                          className="move-swipeable"
                          onSwiped={this.onMoveSwiped}
                          onSwiping={this.onMoveSwiping}
                          preventDefaultTouchmoveEvent={false}
                          trackTouch
                        >
                          <Button
                            color="transparent"
                            onClick={() => {
                              movePage(false);
                            }}
                          >
                            <i className={`${swipingDir === 'Right' ? 'swiping' : ''} fal fa-chevron-left`} />
                          </Button>
                          <div className="scroll-controller">스크롤</div>
                          <Button
                            color="transparent"
                            onClick={() => {
                              movePage(true);
                            }}
                          >
                            <i className={`${swipingDir === 'Left' ? 'swiping' : ''} fal fa-chevron-right`} />
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
};

export default withTranslation()(ShareController);
