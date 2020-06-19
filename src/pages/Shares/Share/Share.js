import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import request from '@/utils/request';
import { Button, EmptyMessage, Popup, SocketClient, TopLogo } from '@/components';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import {
  PageContent,
  ShareNavigator,
  ShareSideMenu,
  ShareSidePopup,
  ShareSideUserPopup,
  ShareStandByPopup,
} from '@/assets';
import './Share.scss';
import { convertUser, convertUsers } from '@/pages/Users/util';
import { Header } from '@/layouts';
import dialog from '@/utils/dialog';

class Share extends React.Component {
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
      chapters: [],
      pages: [],
      currentChapterId: null,
      currentPageId: null,
      currentPage: null,
      isAdmin: false,
      users: [],
      hideShareNavigator: false,
      fullScreen: false,
      openUserPopup: false,
      init: false,
    };
  }

  componentDidMount() {
    const { shareId, init } = this.state;
    const { user } = this.props;
    if (user && !init) {
      this.getShare(shareId);
    }
  }

  componentDidUpdate() {
    const { shareId, share, init } = this.state;
    const { user } = this.props;
    if (user && share.id !== shareId && !init) {
      this.getShare(shareId);
    }
  }

  joinShare = (shareId) => {
    if (this.clientRef) {
      this.clientRef.sendMessage(`/pub/api/shares/${shareId}/contents/join`);
    }
  };

  getShare = (shareId) => {
    request.get(
      `/api/shares/${shareId}/contents`,
      null,
      (data) => {
        const { user } = this.props;

        if (data.access)
          if (data && data.chapters) {
            data.chapters.sort((a, b) => {
              return a.orderNo - b.order;
            });
          }

        this.setState({
          topic: data.topic,
          chapters: data.chapters || [],
          share: data.share,
          currentChapterId: data.share.currentChapterId,
          currentPageId: data.share.currentPageId,
          isAdmin: data.share.adminUserId === user.id,
          users: convertUsers(data.users),
          init: true,
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

  startShare = () => {
    const { shareId, isAdmin } = this.state;
    if (isAdmin) {
      request.put(`/api/shares/${shareId}/contents/start`, null, () => {});
    }
  };

  stopShare = () => {
    const { shareId, isAdmin } = this.state;
    if (isAdmin) {
      request.put(`/api/shares/${shareId}/contents/stop`, null, () => {});
    }
  };

  closeShare = () => {
    const { shareId, isAdmin } = this.state;
    if (isAdmin) {
      request.put(`/api/shares/${shareId}/close`, null, () => {});
    }
  };

  banUser = (userId) => {
    const { shareId, isAdmin } = this.state;
    if (isAdmin) {
      request.put(`/api/shares/${shareId}/contents/users/${userId}/ban`, null, () => {});
    }
  };

  allowUser = (userId) => {
    const { shareId, isAdmin } = this.state;
    if (isAdmin) {
      request.put(`/api/shares/${shareId}/contents/users/${userId}/allow`, null, () => {});
    }
  };

  kickOutUser = (userId) => {
    const { shareId, isAdmin } = this.state;
    if (isAdmin) {
      request.put(`/api/shares/${shareId}/contents/users/${userId}/kickOut`, null, () => {});
    }
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

  sendReadyChat = (message) => {
    const { shareId } = this.state;
    request.post(`/api/shares/${shareId}/contents/chats/ready`, { message }, () => {}, null, true);
  };

  onMessage = (msg) => {
    const { type, data } = msg;
    const { t, history } = this.props;

    console.log(type, data);

    switch (type) {
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
        const { users } = this.state;
        const next = users.slice(0);
        const userIndex = next.findIndex((user) => user.id === data.senderId);
        if (userIndex > -1) {
          next[userIndex].message = data.message;
          this.setState({
            users: next,
          });
        }

        break;
      }

      default: {
        break;
      }
    }
  };

  setHideShareNavigator = (value) => {
    this.setState({
      hideShareNavigator: value,
    });
  };

  setFullScreen = (value) => {
    const elem = document.documentElement;
    if (value) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }

    if (!value) {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }

    this.setState({
      fullScreen: value,
    });
  };

  setOpenUserPopup = (value) => {
    this.setState(
      {
        openUserPopup: value,
      },
      () => {
        window.dispatchEvent(new Event('resize'));
      },
    );
  };

  render() {
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { t, user, location, history } = this.props;

    const {
      // eslint-disable-next-line no-unused-vars,no-shadow
      topic,
      // eslint-disable-next-line no-unused-vars,no-shadow
      shareId,
      // eslint-disable-next-line no-unused-vars,no-shadow
      share,
      chapters,
      pages,
      currentChapterId,
      currentPageId,
      currentPage,
      isAdmin,
      users,
      hideShareNavigator,
      fullScreen,
      openUserPopup,
      init,
    } = this.state;

    return (
      <div className="content-viewer-wrapper">
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
              topics={[`/sub/share-room/${shareId}`]}
              onMessage={this.onMessage}
              onConnect={() => {
                this.joinShare(shareId);
              }}
              onDisconnect={() => {}}
              setRef={(client) => {
                this.clientRef = client;
              }}
            />
            <div className={`viewer-top g-no-select ${hideShareNavigator ? 'hide' : ''}`}>
              <div>
                <div className="logo-area">
                  <TopLogo />
                </div>
                <div className="menu">
                  {chapters.length > 0 && (
                    <>
                      <ShareNavigator
                        className="chapters-menu"
                        list={chapters}
                        selectedId={currentChapterId}
                        onClick={this.setChapter}
                        onPrevClick={this.setChapter}
                        onNextClick={this.setChapter}
                      />
                      <ShareNavigator
                        className="pages-menu"
                        list={pages}
                        selectedId={currentPageId}
                        onClick={this.setPage}
                        onPrevClick={this.setPage}
                        onNextClick={this.setPage}
                      />
                    </>
                  )}
                  {chapters.length < 1 && (
                    <div className="no-menu">
                      <div>작성된 컨텐츠가 없습니다</div>
                    </div>
                  )}
                </div>
                <div className="side-menu">
                  <ShareSideMenu
                    share={share}
                    isAdmin={isAdmin}
                    stopShare={this.stopShare}
                    hideShareNavigator={hideShareNavigator}
                    setHideShareNavigator={this.setHideShareNavigator}
                    fullScreen={fullScreen}
                    setFullScreen={this.setFullScreen}
                    openUserPopup={openUserPopup}
                    setOpenUserPopup={this.setOpenUserPopup}
                  />
                </div>
              </div>
            </div>
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
              {openUserPopup && (
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
                    banUser={this.banUser}
                    kickOutUser={this.kickOutUser}
                    allowUser={this.allowUser}
                    isAdmin={isAdmin}
                  />
                </ShareSidePopup>
              )}
            </div>
            <div className="screen-type d-none" onClick={() => {}}>
              <div className="mb-2">이 스크린의 타입을 선택해주세요</div>
              <div>
                <Button color="primary">프리젠테이션 스크린</Button>
                <Button color="primary">웹 페이지</Button>
                <Button color="primary">컨트롤러</Button>
              </div>
            </div>
            {!share.startedYn && (
              <Popup open>
                <ShareStandByPopup
                  users={users}
                  share={share}
                  isAdmin={isAdmin}
                  user={user}
                  sendReadyChat={this.sendReadyChat}
                  startShare={this.startShare}
                  closeShare={this.closeShare}
                  exitShare={() => {
                    history.push('/shares');
                  }}
                />
              </Popup>
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(Share)));
