import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { addMessage } from 'actions';
import request from '@/utils/request';
import './ContentViewer.scss';
import { setConfirm } from '@/actions';
import ShareReady from './ShareReady';
import { Button, ContentViewerMenu, PageContent, Popup, SocketClient, TopLogo } from '@/components';
import { MESSAGE_CATEGORY } from '@/constants/constants';

class ContentViewer extends React.Component {
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
    };
  }

  componentDidMount() {
    const { shareId } = this.state;
    const { user } = this.props;
    if (user) {
      this.getShare(shareId);
    }
  }

  componentDidUpdate() {
    const { shareId, share } = this.state;
    const { user } = this.props;
    if (user && share.id !== shareId) {
      this.getShare(shareId);
    }
  }

  joinShare = (shareId) => {
    console.log('joinShare');
    request.put(`/api/shares/${shareId}/contents/join`, null);
  };

  getShare = (shareId) => {
    request.get(`/api/shares/${shareId}/contents`, null, (data) => {
      const { user } = this.props;

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
        users: data.users,
      });

      this.getPages(shareId, data.share.currentChapterId);
    });
  };

  getPages = (shareId, chapterId, pageId, setFirstPage, setLastPage) => {
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
    const { t, history, addMessage: addMessageReducer } = this.props;

    console.log(type, data);

    switch (type) {
      case 'SHARE_CLOSED': {
        history.push('/shares');
        addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('공유 종료'), t('공유가 종료되어 화면이 이동되었습니다.'));
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

      case 'USER_JOINED': {
        const { users } = this.state;
        const next = users.slice(0);

        console.log(data.user);

        const userIndex = next.findIndex((user) => user.id === data.user.id);
        if (userIndex < 0) {
          next.push(data.user);
          this.setState({
            users: next,
          });
        } else {
          next[userIndex] = data.user;
          this.setState({
            users: next,
          });
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

  render() {
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { t, setConfirm, user, location } = this.props;

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
    } = this.state;

    return (
      <div className="content-viewer-wrapper">
        <SocketClient
          topics={[`/sub/share-room/${shareId}/${user != null ? user.uuid : ''}`]}
          onMessage={this.onMessage}
          onConnect={() => {
            this.joinShare(shareId);
          }}
          onDisconnect={() => {}}
        />
        <div className="viewer-top g-no-select">
          <div className="logo-area">
            <TopLogo />
          </div>
          <div className="menu">
            <ContentViewerMenu
              className="chapters-menu"
              list={chapters}
              selectedId={currentChapterId}
              onClick={this.setChapter}
              onPrevClick={this.setChapter}
              onNextClick={this.setChapter}
            />
            <ContentViewerMenu
              className="pages-menu"
              list={pages}
              selectedId={currentPageId}
              onClick={this.setPage}
              onPrevClick={this.setPage}
              onNextClick={this.setPage}
            />
          </div>
          <div className="side-menu">
            <span onClick={this.stopShare}>
              <i className="fal fa-wifi" />
            </span>
            <span>
              <i className="fal fa-id-badge" />
            </span>
            <span>
              <i className="fal fa-level-up" />
            </span>
            <span>
              <i className="fal fa-expand" />
            </span>
            {isAdmin && (
              <span>
                <i className="fal fa-poll" />
              </span>
            )}
            <span>
              <i className="fal fa-file-alt" />
            </span>
            <span>
              <i className="fal fa-solar-panel" />
            </span>
            <span className="d-none">
              <i className="fal fa-chart-line" />
            </span>
            <span className="d-none">
              <i className="fal fa-clock" />
            </span>
            <span className="d-none">
              <i className="fal fa-users-class" />
            </span>
            <span className="d-none">
              <i className="fal fa-cog" />
            </span>
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
            />
          )}
        </div>
        {share.startedYn && (
          <>
            <div
              className="prev-page"
              onClick={() => {
                this.movePage(false);
              }}
            >
              <div>
                <i className="fal fa-chevron-left" />
              </div>
            </div>
            <div
              className="next-page"
              onClick={() => {
                this.movePage(true);
              }}
            >
              <div>
                <i className="fal fa-chevron-right" />
              </div>
            </div>
          </>
        )}
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
            <ShareReady
              users={users}
              share={share}
              isAdmin={isAdmin}
              user={user}
              sendReadyChat={this.sendReadyChat}
              startShare={this.startShare}
              closeShare={this.closeShare}
            />
          </Popup>
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

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
  };
};

ContentViewer.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
    uuid: PropTypes.string,
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
  setConfirm: PropTypes.func,
  addMessage: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ContentViewer)));
