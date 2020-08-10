import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import request from '@/utils/request';
import messageClient from './client';
import { EmptyMessage, SocketClient } from '@/components';
import { MESSAGE_CATEGORY, SCREEN_TYPE } from '@/constants/constants';
import {
  PageContent,
  ScreenTypeSelector,
  ShareController,
  ShareHeader,
  ShareSidePopup,
  ShareSideUserPopup,
  ShareStandByPopup,
} from '@/assets';
import './Share.scss';
import { convertUser, convertUsers } from '@/pages/Users/util';
import { Header } from '@/layouts';
import dialog from '@/utils/dialog';

const detectBrowserFocus = false;

class Share extends React.Component {
  contentViewer = React.createRef();

  constructor(props) {
    super(props);
    const {
      match: {
        params: { shareId },
      },
    } = this.props;

    this.state = {
      topic: {},
      shareId: Number(shareId),
      share: {},
      accessCode: {},
      chapters: [],
      pages: [],
      chapterPageList: [],
      currentChapterId: null,
      currentPageId: null,
      currentPage: null,
      isAdmin: false,
      users: [],
      isOpenUserPopup: false,
      init: false,
      // screenType: SCREEN_TYPE.WEB,
      screenType: SCREEN_TYPE.PROJECTOR,
      openScreenSelector: false,
      messages: [],
      projectorScrollInfo: {},
      options: {
        hideShareNavigator: false,
        fullScreen: false,
      },
      isOpenCam: false,
    };

    this.onScrollDebounced = debounce(messageClient.sendScrollInfo, 300);
    this.sendFocusChangeDebounced = debounce(this.sendFocusChange, 300);
  }

  componentDidMount() {
    const { shareId, init } = this.state;
    const { user } = this.props;
    if (user && !init) {
      this.getShare(shareId);
    }

    document.addEventListener('scroll', this.onScroll);
    if (detectBrowserFocus) {
      window.addEventListener('focus', this.onFocus);
      window.addEventListener('blur', this.onFocus);
    }
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.onScroll);
    if (detectBrowserFocus) {
      window.removeEventListener('focus', this.onFocus);
      window.removeEventListener('blur', this.onFocus);
    }

    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.onScrollDebounced.cancel();
    this.sendFocusChangeDebounced.cancel();
  }

  componentDidUpdate(prevProps, prevState) {
    const { shareId, share, init, currentPageId, screenType } = this.state;
    const { user } = this.props;
    if (user && share.id !== shareId && !init) {
      this.getShare(shareId);
    }

    if (screenType === SCREEN_TYPE.PROJECTOR && currentPageId !== prevState.currentPageId) {
      this.onScroll();
    }
  }

  onVisibilityChange = () => {
    this.sendFocusChangeDebounced(document.visibilityState === 'visible');
  };

  onFocus = (e) => {
    if (detectBrowserFocus) {
      this.sendFocusChangeDebounced(e.type === 'focus');
    }
  };

  onScroll = () => {
    const { shareId, screenType } = this.state;

    if (screenType === SCREEN_TYPE.PROJECTOR) {
      const windowHeight = window.innerHeight;
      const contentViewerHeight =
        this.contentViewer && this.contentViewer.current && this.contentViewer.current.clientHeight;
      if (windowHeight && contentViewerHeight) {
        this.onScrollDebounced(shareId, windowHeight, contentViewerHeight, document.documentElement.scrollTop);
      }
    }
  };

  sendFocusChange = (focus) => {
    const { shareId } = this.state;
    messageClient.focusChange(this.clientRef, shareId, focus);
  };

  sendMoveScroll = (dir) => {
    const { shareId, isAdmin } = this.state;

    if (isAdmin) {
      messageClient.sendMoveScroll(shareId, dir);
    }
  };

  getShare = (shareId) => {
    request.get(
      `/api/shares/${shareId}/contents`,
      null,
      (data) => {
        const { user } = this.props;

        if (data && data.chapters) {
          data.chapters.sort((a, b) => {
            return a.orderNo - b.order;
          });
        }

        if (data && data.chapterPageList) {
          data.chapterPageList.forEach((chapter) => {
            chapter.pages.sort((a, b) => {
              return a.orderNo - b.order;
            });
          });
        }

        const isAdmin = data.share.adminUserId === user.id;

        data.messages.forEach((m) => {
          m.user = convertUser(m.user);
        });

        const { topic } = data;
        topic.content = JSON.parse(topic.content);

        this.setState({
          topic,
          chapters: data.chapters || [],
          share: data.share,
          accessCode: data.accessCode,
          currentChapterId: data.share.currentChapterId,
          currentPageId: data.share.currentPageId,
          chapterPageList: data.chapterPageList,
          isAdmin,
          users: convertUsers(data.users),
          init: true,
          // openScreenSelector: isAdmin,
          openScreenSelector: false,
          messages: data.messages,
        });

        this.getPages(shareId, data.share.currentChapterId);
      },
      (error, response) => {
        const { t, history } = this.props;

        if (response.data.code === 'SHARE_NOT_EXISTS_SHARE') {
          this.setState({
            init: true,
          });
          dialog.setMessage(
            MESSAGE_CATEGORY.INFO,
            t('토픽에 참여할 수 없습니다'),
            t('공유가 종료된 토픽이거나, 찾을 수 없는 토픽입니다.'),
          );
        } else if (response.data.code === 'SHARE_NEED_ACCESS_CODE') {
          history.push(`/shares/${shareId}/code`);
        } else if (response.data.code === 'SHARE_BANNED_USER') {
          history.push('/shares');
          dialog.setMessage(MESSAGE_CATEGORY.INFO, t('접속 오류'), response.data.message);
        } else {
          this.setState({
            init: true,
          });
          dialog.setMessage(MESSAGE_CATEGORY.INFO, t('요청이 올바르지 않습니다.'), response.data.message);
        }
      },
    );
  };

  getPages = (shareId, chapterId, pageId, setFirstPage, setLastPage) => {
    if (!chapterId) {
      return;
    }

    request.get(
      `/api/shares/${shareId}/contents/chapters/${chapterId}/pages`,
      {},
      (data) => {
        const { currentPageId } = this.state;
        let nextPageId = pageId || currentPageId;
        if (setFirstPage) {
          nextPageId = data.pages.length > 0 ? data.pages[0].id : null;
        }

        if (setLastPage) {
          nextPageId = data.pages.length > 0 ? data.pages[data.pages.length - 1].id : null;
        }

        this.setState(
          {
            currentChapterId: chapterId,
            currentPageId: nextPageId,
            pages: data.pages || [],
            currentPage: data.pages.find((p) => p.id === nextPageId),
          },
          () => {
            if (setFirstPage || setLastPage) {
              this.setPage(nextPageId);
            }
          },
        );
      },
      null,
      true,
    );
  };

  setPageContent = (pageId, content) => {
    const { pages } = this.state;
    const next = pages.slice(0);
    const page = next.find((p) => p.id === pageId);
    if (page) {
      page.content = content;
    }

    this.setState({
      pages: next,
    });
  };

  setPage = (pageId) => {
    const { shareId, currentChapterId, pages, isAdmin } = this.state;

    if (isAdmin) {
      request.put(
        `/api/shares/${shareId}/contents/current/chapters/${currentChapterId}/pages/${pageId}`,
        null,
        () => {},
      );
    }

    this.setState({
      currentPageId: pageId,
      currentPage: pages.find((p) => p.id === pageId),
    });
  };

  setChapter = (chapterId, setFirstPage, setLastPage) => {
    const { shareId } = this.state;
    this.getPages(shareId, chapterId, null, setFirstPage, setLastPage);
  };

  movePage = (isNext) => {
    const { pages, chapters, currentChapterId, currentPageId } = this.state;
    const currentPageIndex = pages.findIndex((page) => page.id === currentPageId);

    if (currentPageIndex < 0) {
      return;
    }

    if (isNext) {
      if (currentPageIndex >= pages.length - 1) {
        const currentChapterIndex = chapters.findIndex((chapter) => chapter.id === currentChapterId);
        if (currentChapterIndex < chapters.length - 1) {
          this.setChapter(chapters[currentChapterIndex + 1].id, true, false);
        }
      } else {
        this.setPage(pages[currentPageIndex + 1].id);
      }
    } else if (currentPageIndex < 1) {
      const currentChapterIndex = chapters.findIndex((chapter) => chapter.id === currentChapterId);
      if (currentChapterIndex > 0) {
        this.setChapter(chapters[currentChapterIndex - 1].id, false, true);
      }
    } else {
      this.setPage(pages[currentPageIndex - 1].id);
    }
  };

  moveScroll = (dir) => {
    const windowHeight = window.innerHeight;
    const contentViewerHeight =
      this.contentViewer && this.contentViewer.current && this.contentViewer.current.clientHeight;
    const scrollTotalSize = contentViewerHeight - windowHeight;
    const scrollTotalTick = scrollTotalSize / 5;
    const { scrollTop } = document.documentElement;

    if (scrollTotalSize < 0) {
      return;
    }

    if (dir === 'up' && scrollTop > 0) {
      let nextScrollTop = scrollTop - scrollTotalTick;
      if (nextScrollTop < 0) {
        nextScrollTop = 0;
      }

      document.documentElement.scrollTop = nextScrollTop;
    }

    if (dir === 'down' && scrollTop < scrollTotalSize) {
      let nextScrollTop = scrollTop + scrollTotalTick;
      if (nextScrollTop > scrollTotalSize) {
        nextScrollTop = scrollTotalSize;
      }

      document.documentElement.scrollTop = nextScrollTop;
    }
  };

  onMessage = (msg) => {
    const { type, data } = msg;
    const { t, history } = this.props;
    const { screenType } = this.state;

    console.log(type, data);

    switch (type) {
      case 'SCROLL_INFO_CHANGED': {
        this.setState({
          projectorScrollInfo: data.scrollInfo,
        });
        break;
      }

      case 'MOVE_SCROLL': {
        this.moveScroll(data.dir);
        break;
      }

      case 'SCREEN_TYPE_REGISTERED': {
        if (screenType === SCREEN_TYPE.PROJECTOR) {
          this.setState({
            options: {
              hideShareNavigator: true,
              fullScreen: false,
            },
          });
          this.onScroll();
        }
        break;
      }

      case 'SHARE_CLOSED': {
        history.push('/shares');
        dialog.setMessage(MESSAGE_CATEGORY.INFO, t('공유 종료'), t('공유가 종료되어 화면이 이동되었습니다.'));
        break;
      }

      case 'SHARE_STARTED_STATUS_CHANGE': {
        const { share } = this.state;
        const next = { ...share };
        next.startedYn = data.startedYn;
        this.setState({
          share: next,
        });
        break;
      }

      case 'CURRENT_PAGE_CHANGE': {
        const { pages, shareId, currentChapterId, currentPageId } = this.state;
        const { pageId, chapterId } = data;
        if (currentChapterId !== chapterId || currentPageId !== pageId) {
          if (currentChapterId !== chapterId) {
            this.getPages(shareId, chapterId, pageId);
          } else {
            this.setState({
              currentPageId: pageId,
              currentPage: pages.find((p) => p.id === pageId),
            });
          }
        }

        break;
      }
      case 'USER_STATUS_CHANGE':
      case 'USER_JOINED': {
        const { users } = this.state;
        const next = users.slice(0);
        const userIndex = next.findIndex((user) => user.id === data.user.id);

        if (userIndex < 0) {
          next.push(convertUser(data.user));
          this.setState({
            users: next,
          });
        } else {
          next[userIndex] = convertUser(data.user);
          this.setState({
            users: next,
          });
        }

        break;
      }

      case 'USER_FOCUS_CHANGE': {
        const { users } = this.state;
        const next = users.slice(0);
        const userIndex = next.findIndex((user) => user.id === data.userId);

        if (userIndex > -1) {
          next[userIndex].focusYn = data.focus;
          this.setState({
            users: next,
          });
        }

        break;
      }

      case 'USER_BAN': {
        const { users } = this.state;
        const { user } = this.props;
        const next = users.slice(0);
        const userIndex = next.findIndex((u) => u.id === data.userId);

        if (userIndex > -1) {
          next[userIndex].banYn = true;
          next[userIndex].status = 'OFFLINE';
          this.setState({
            users: next,
          });
        }

        if (data.userId === user.id) {
          history.push('/shares');
          dialog.setMessage(MESSAGE_CATEGORY.INFO, t('공유 종료'), t('관리자에 의해서 토픽에서 퇴장되었습니다.'));
        }

        break;
      }

      case 'USER_ALLOWED': {
        const { users } = this.state;
        const next = users.slice(0);
        const userIndex = next.findIndex((u) => u.id === data.userId);

        if (userIndex > -1) {
          next[userIndex].banYn = false;
          this.setState({
            users: next,
          });
        }

        break;
      }

      case 'USER_KICK_OUT': {
        const { users } = this.state;
        const { user } = this.props;
        const next = users.slice(0);
        const userIndex = next.findIndex((u) => u.id === data.userId);

        if (userIndex > -1) {
          next.splice(userIndex, 1);
          this.setState({
            users: next,
          });
        }

        if (data.userId === user.id) {
          history.push('/shares');
          dialog.setMessage(MESSAGE_CATEGORY.INFO, t('공유 종료'), t('관리자에 의해서 토픽에서 퇴장되었습니다.'));
        }

        break;
      }

      case 'CHAT_MESSAGE': {
        const { users, messages } = this.state;
        const next = users.slice(0);
        const nextMessages = messages.slice(0);
        const userIndex = next.findIndex((user) => user.id === data.senderId);
        if (userIndex > -1) {
          next[userIndex].message = data.message;

          const message = {
            message: data.message,
            creationDate: String(new Date()),
            user: next[userIndex],
          };
          nextMessages.push(message);

          this.setState({
            users: next,
            messages: nextMessages,
          });
        }

        break;
      }

      case 'OPTION_CHANGE': {
        const { options } = this.state;
        const next = { ...options };
        next[data.optionKey] = data.optionValue;

        console.log(next);

        if (screenType === SCREEN_TYPE.PROJECTOR) {
          this.setState({
            options: next,
          });
        }

        break;
      }

      default: {
        break;
      }
    }
  };

  setOpenUserPopup = (value) => {
    this.setState(
      {
        isOpenUserPopup: value,
      },
      () => {
        window.dispatchEvent(new Event('resize'));
      },
    );
  };

  setOpenCamPopup = (value) => {
    this.setState(
      {
        isOpenCam: value,
      },
      () => {
        window.dispatchEvent(new Event('resize'));
      },
    );
  };

  setOption = (key, value) => {
    const { screenType, shareId, options } = this.state;
    const next = {
      ...options,
    };
    next[key] = value;

    this.setState({
      options: next,
    });

    console.log(shareId, key, value);

    if (screenType === SCREEN_TYPE.CONTROLLER) {
      messageClient.sendOption(shareId, key, value);
    }
  };

  render() {
    const { t, user, history } = this.props;

    const {
      topic,
      shareId,
      share,
      chapters,
      pages,
      chapterPageList,
      currentChapterId,
      currentPageId,
      currentPage,
      isAdmin,
      users,
      isOpenUserPopup,
      init,
      accessCode,
      options,
      isOpenCam,
    } = this.state;

    const { screenType, openScreenSelector, messages, projectorScrollInfo } = this.state;

    return (
      <div className="content-viewer-wrapper" ref={this.contentViewer}>
        {!(share && share.id) && (
          <>
            <Header />
            <div className="empty-share">
              <EmptyMessage
                className="h5 text-white"
                message={
                  <div>
                    {!init && <div>{t('잠시만 기다려주세요')}</div>}
                    {init && <div>{t('공유가 종료된 토픽이거나, 찾을 수 없는 토픽입니다.')}</div>}
                  </div>
                }
              />
            </div>
          </>
        )}
        {share && share.id && (
          <>
            <SocketClient
              topics={[`/sub/share-room/${shareId}`, `/user/sub/share-room/${shareId}`]}
              onMessage={this.onMessage}
              onConnect={() => {
                messageClient.joinShare(this.clientRef, shareId);
              }}
              onDisconnect={() => {}}
              setRef={(client) => {
                this.clientRef = client;
              }}
            />
            {isAdmin && screenType === SCREEN_TYPE.CONTROLLER && (
              <ShareController
                topic={topic}
                share={share}
                users={users}
                isAdmin={isAdmin}
                startShare={() => {
                  messageClient.startShare(shareId);
                }}
                closeShare={() => {
                  messageClient.closeShare(shareId);
                }}
                stopShare={() => {
                  messageClient.stopShare(shareId);
                }}
                exitShare={() => {
                  history.push('/shares');
                }}
                banUser={(userId) => {
                  messageClient.banUser(shareId, userId);
                }}
                kickOutUser={(userId) => {
                  messageClient.kickOutUser(shareId, userId);
                }}
                allowUser={(userId) => {
                  messageClient.allowUser(shareId, userId);
                }}
                messages={messages}
                user={user}
                sendReadyChat={(message) => {
                  messageClient.sendReadyChat(shareId, message);
                }}
                chapterPageList={chapterPageList}
                currentChapterId={currentChapterId}
                currentPageId={currentPageId}
                movePage={this.movePage}
                projectorScrollInfo={projectorScrollInfo}
                sendMoveScroll={this.sendMoveScroll}
                setOption={this.setOption}
              />
            )}
            {!(isAdmin && screenType === SCREEN_TYPE.CONTROLLER) && (
              <>
                <ShareHeader
                  isAdmin={isAdmin}
                  share={share}
                  chapters={chapters}
                  pages={pages}
                  currentChapterId={currentChapterId}
                  currentPageId={currentPageId}
                  isOpenUserPopup={isOpenUserPopup}
                  isOpenCam={isOpenCam}
                  setChapter={this.setChapter}
                  setPage={this.setPage}
                  stopShare={() => {
                    messageClient.stopShare(shareId);
                  }}
                  setOpenUserPopup={this.setOpenUserPopup}
                  setOpenCamPopup={this.setOpenCamPopup}
                  options={options}
                  setOption={this.setOption}
                />
                <div className="content">
                  {share.startedYn && currentPage && (
                    <PageContent
                      content={JSON.parse(currentPage.content)}
                      setPageContent={this.setPageContent}
                      onLayoutChange={this.onLayoutChange}
                      setSelectedItem={this.setSelectedItem}
                      onChangeValue={this.onChangeValue}
                      setEditing={this.setEditing}
                      movePage={this.movePage}
                    />
                  )}
                  {share.startedYn && !currentPage && (
                    <div className="empty-page">
                      <EmptyMessage
                        className="h5"
                        message={
                          <div>
                            <div>{t('선택된 컨텐츠가 없습니다')}</div>
                          </div>
                        }
                      />
                    </div>
                  )}
                  {isOpenUserPopup && (
                    <ShareSidePopup
                      name="user-popup"
                      className="open-user-popup"
                      title={`참여중인 사용자 (${
                        users.filter((u) => !u.banYn).filter((u) => u.status === 'ONLINE').length
                      }/${users.filter((u) => !u.banYn).length})`}
                      arrowRight={isAdmin ? '126px' : '110px'}
                      setOpen={this.setOpenUserPopup}
                    >
                      <ShareSideUserPopup
                        user={user}
                        users={users}
                        banUser={(userId) => {
                          messageClient.banUser(shareId, userId);
                        }}
                        kickOutUser={(userId) => {
                          messageClient.kickOutUser(shareId, userId);
                        }}
                        allowUser={(userId) => {
                          messageClient.allowUser(shareId, userId);
                        }}
                        isAdmin={isAdmin}
                      />
                    </ShareSidePopup>
                  )}
                </div>
              </>
            )}
            {(!openScreenSelector || !isAdmin) && !share.startedYn && screenType !== SCREEN_TYPE.CONTROLLER && (
              <ShareStandByPopup
                screenType={screenType}
                accessCode={accessCode}
                users={users}
                share={share}
                isAdmin={isAdmin}
                user={user}
                messages={messages}
                sendReadyChat={(message) => {
                  messageClient.sendReadyChat(shareId, message);
                }}
                startShare={() => {
                  messageClient.startShare(shareId);
                }}
                closeShare={() => {
                  messageClient.closeShare(shareId);
                }}
                exitShare={() => {
                  history.push('/shares');
                }}
              />
            )}
            {isAdmin && openScreenSelector && (
              <ScreenTypeSelector
                onSelect={(value) => {
                  messageClient.registerScreenType(this.clientRef, shareId, value);
                  this.setState(
                    {
                      openScreenSelector: false,
                      screenType: value,
                    },
                    () => {
                      this.onScroll();
                    },
                  );
                }}
                exitShare={() => {
                  history.push('/shares');
                }}
              />
            )}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

Share.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  t: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      shareId: PropTypes.string,
      topicId: PropTypes.string,
      chapterId: PropTypes.string,
    }),
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(Share)));
