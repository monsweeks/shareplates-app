import React from 'react';
import PropTypes from 'prop-types';
import { Prompt, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, EmptyMessage } from '@/components';

import request from '@/utils/request';
import { PageCardLayoutList, PageEditor, PageEditorShortKeyInfo, PageListTopMenu } from '@/assets';
import { DEFAULT_PAGE_CONTENT } from '@/assets/Topics/PageEditor/PageController/constants';
import './Page.scss';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';

class Page extends React.Component {
  pageEditorRef = React.createRef();

  pageList = React.createRef();

  pageListMouseHover = false;

  constructor(props) {
    super(props);
    const {
      match: {
        params: { topicId, chapterId },
      },
    } = this.props;

    this.state = {
      topicId: Number(topicId),
      topic: {},
      chapterId: Number(chapterId),
      chapter: {},
      pages: false,
      selectedPageId: null,
      showPageList: true,
      selectedPageList: false,
      showShortKeyGuide: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.match.params.topicId &&
      props.match.params.chapterId &&
      (state.topicId !== props.match.params.topicId || state.chapterId !== props.match.params.chapterId)
    ) {
      return {
        topicId: Number(props.match.params.topicId),
        chapterId: Number(props.match.params.chapterId),
      };
    }

    return null;
  }

  componentDidMount() {
    const { topicId, chapterId } = this.state;

    if (topicId && chapterId) {
      this.getPages(topicId, chapterId);
    }

    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    document.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  onBeforeUnload = (e) => {
    e.preventDefault();

    const { selectedPageId, pages } = this.state;
    const page = pages.find((p) => p.id === selectedPageId);
    if (page && page.dirty) {
      e.returnValue = '이 페이지를 벗어나면, 변경 내용이 저장되지 않습니다.';
    }
  };

  onKeyUp = (e) => {
    const { showShortKeyGuide } = this.state;
    if (showShortKeyGuide && (e.key === 'Control' || e.key === 'Alt')) {
      this.setState({
        showShortKeyGuide: false,
      });
    }
  };

  onKeyDown = (e) => {
    const { selectedPageId, selectedPageList, showShortKeyGuide } = this.state;

    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      if (this.pageEditorRef) {
        this.pageEditorRef.updateContent();
      }
      return;
    }

    if (selectedPageList && e.altKey && e.key === 'n') {
      e.preventDefault();
      this.createPage();
    }

    if (this.pageListMouseHover && selectedPageId && e.key === 'Delete') {
      dialog.setConfirm(MESSAGE_CATEGORY.WARNING, '데이터 삭제 경고', '페이지를 삭제하시겠습니까?', () => {
        this.deletePage(selectedPageId);
      });
    }

    if (this.pageListMouseHover && (e.ctrlKey || e.altKey) && !showShortKeyGuide) {
      this.setState({
        showShortKeyGuide: true,
      });
    }
  };

  onMouseDown = (e) => {
    const { selectedPageList } = this.state;
    if (selectedPageList && this.pageList.current && !this.pageList.current.contains(e.target)) {
      this.setState({
        selectedPageList: false,
      });
    }
  };

  getPages = (topicId, chapterId) => {
    request.get(`/api/topics/${topicId}/chapters/${chapterId}/pages`, {}, (data) => {
      const { topic, chapter } = data;
      if (topic && topic.content) {
        topic.content = JSON.parse(topic.content);
      }

      if (chapter && chapter.content) {
        chapter.content = JSON.parse(chapter.content);
      }

      this.setState({
        topic,
        chapter,
        pages: data.pages || [],
      });
    });
  };

  createPage = () => {
    const { topicId, chapterId, pages } = this.state;
    const orderNo = pages.length + 1;
    const title = `PAGE-${orderNo}`;
    const content = JSON.parse(JSON.stringify(DEFAULT_PAGE_CONTENT));

    request.post(
      `/api/topics/${topicId}/chapters/${chapterId}/pages`,
      { topicId, chapterId, title, orderNo, content: JSON.stringify(content) },
      (data) => {
        const next = pages.slice(0);
        next.push(data.page);
        this.setState({
          pages: next,
        });
      },
      null,
      true,
    );
  };

  updatePageOrders = () => {
    const { topicId, chapterId, pages } = this.state;

    request.put(
      `/api/topics/${topicId}/chapters/${chapterId}/pages/orders`,
      { topicId, chapterId, pages },
      null,
      null,
      true,
    );
  };

  setSelectedPageId = (selectedPageId) => {
    const { selectedPageId: currentSelectedPageId, pages, selectedPageList } = this.state;

    if (currentSelectedPageId === selectedPageId) {
      if (!selectedPageList && !selectedPageId) {
        this.setState({
          selectedPageList: true,
        });
      }
      return;
    }

    const next = pages.slice(0);
    const page = next.find((p) => p.id === currentSelectedPageId);
    if (page && page.dirty) {
      dialog.setConfirm(
        MESSAGE_CATEGORY.WARNING,
        '데이터가 저장되지 않았습니다',
        '변경된 페이지 내용이 저장되지 않았습니다. 그래도 다른 페이지를 불러오시겠습니까?',
        () => {
          page.dirty = false;
          this.setState({
            selectedPageId,
            pages: next,
            selectedPageList: !selectedPageId,
          });
        },
      );
    } else {
      this.setState({
        selectedPageId,
        selectedPageList: !selectedPageId,
      });
    }
  };

  updatePageTitle = (pageId, title) => {
    const { topicId, chapterId } = this.state;
    request.put(
      `/api/topics/${topicId}/chapters/${chapterId}/pages/${pageId}/title`,
      { title },
      (data) => {
        const { pages } = this.state;
        const next = pages.slice(0);
        const page = next.find((d) => String(d.id) === String(data.page.id));
        page.title = data.page.title;
        this.setState({
          pages: next,
        });
      },
      null,
      true,
    );
  };

  deletePage = (pageId) => {
    const { topicId, chapterId, selectedPageId } = this.state;

    request.del(
      `/api/topics/${topicId}/chapters/${chapterId}/pages/${pageId}`,
      null,
      () => {
        const { pages } = this.state;
        const next = pages.slice(0);
        const index = next.findIndex((page) => page.id === pageId);

        if (index > -1) {
          next.splice(index, 1);

          this.setState({
            pages: next,
            selectedPageId: selectedPageId === pageId ? null : selectedPageId,
          });
        }
      },
      null,
      true,
    );
  };

  updatePage = (pageId, content) => {
    const { topicId, chapterId } = this.state;

    request.put(
      `/api/topics/${topicId}/chapters/${chapterId}/pages/${pageId}`,
      {
        content,
      },
      (data) => {
        const { pages } = this.state;
        const next = pages.slice(0);
        const index = next.findIndex((p) => p.id === pageId);
        next[index] = data.page;

        this.setState({
          pages: next,
        });
      },
      null,
      true,
    );
  };

  updateTopicContent = (content) => {
    const { topicId } = this.state;

    request.put(
      `/api/topics/${topicId}/content`,
      {
        id: topicId,
        content,
      },
      () => {
        const { topic } = this.state;
        const next = { ...topic };
        next.content = JSON.parse(content);
        this.setState({
          topic: next,
        });
      },
      null,
      true,
    );
  };

  updateChapterContent = (content) => {
    const { topicId, chapterId } = this.state;

    request.put(
      `/api/topics/${topicId}/chapters/${chapterId}/content`,
      {
        id: chapterId,
        content,
      },
      () => {
        const { chapter } = this.state;
        const next = { ...chapter };
        next.content = JSON.parse(content);
        this.setState({
          chapter: next,
        });
      },
      null,
      true,
    );
  };

  setShowPageList = (value) => {
    this.setState({
      showPageList: value,
    });
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

  setPageDirty = (pageId, dirty) => {
    const { pages } = this.state;
    const next = pages.slice(0);
    const page = next.find((p) => p.id === pageId);
    if (page) {
      page.dirty = dirty;
    }

    this.setState({
      pages: next,
    });
  };

  movePage = (targetPageId, destPageId, right) => {
    if (targetPageId === destPageId) {
      return;
    }

    const { pages } = this.state;
    const next = pages.slice(0);

    const targetIndex = next.findIndex((page) => page.id === targetPageId);
    const target = next[targetIndex];
    next.splice(targetIndex, 1);

    const destIndex = next.findIndex((page) => page.id === destPageId);
    if (right) {
      next.splice(destIndex + 1, 0, target);
    } else {
      next.splice(destIndex, 0, target);
    }

    next.forEach((d, i) => {
      // eslint-disable-next-line no-param-reassign
      d.orderNo = i + 1;
    });

    this.setState({
      pages: next,
    });
  };

  render() {
    const { t } = this.props;
    const {
      topicId,
      topic,
      chapterId,
      chapter,
      pages,
      selectedPageId,
      showPageList,
      selectedPageList,
      showShortKeyGuide,
    } = this.state;
    const isWriter = true;

    const page = pages && pages.find((p) => p.id === selectedPageId);

    return (
      <div className="page-manager-wrapper">
        <Prompt when={Boolean(page && page.dirty)} message="이 페이지를 벗어나면, 변경 내용이 저장되지 않습니다." />
        {showShortKeyGuide && <PageEditorShortKeyInfo className="short-key-guide" />}
        {showPageList && (
          <div className="page-list-layout">
            <PageListTopMenu
              title={chapter && chapter.title}
              t={t}
              leftButtons={[
                <Button
                  data-tip={t('페이지 목록 숨김')}
                  key="save"
                  onClick={() => {
                    this.setShowPageList(false);
                  }}
                  className="g-icon-button"
                  color="white"
                  size="sm"
                >
                  <div>
                    <i className="fal fa-chevron-double-left" />
                  </div>
                </Button>,
              ]}
              rightButtons={[
                <Button
                  data-tip={t('현재 페이지 저장')}
                  key="save"
                  onClick={() => {
                    if (this.pageEditorRef) {
                      this.pageEditorRef.updateContent();
                    }
                  }}
                  className="g-icon-button"
                  color="white"
                  size="sm"
                  disabled={!selectedPageId}
                >
                  <div>
                    <i className="fas fa-save" />
                  </div>
                </Button>,
                <Button
                  data-tip={t('페이지 추가')}
                  key="add"
                  onClick={this.createPage}
                  className="g-icon-button"
                  color="white"
                  size="sm"
                >
                  <div>
                    <i className="fal fa-plus" />
                  </div>
                </Button>,
              ]}
            />
            {pages.length < 1 && (
              <EmptyMessage
                className="h5 p-3"
                message={
                  <div>
                    <div className="mb-2">{t('페이지가 없습니다.')}</div>
                    {isWriter && <div className="mb-4">{t('페이지를 추가해서 컨텐츠를 만들어보세요.')}</div>}
                    {isWriter && (
                      <Button onClick={this.createPage} color="primary">
                        <i className="fal fa-plus mr-2" />
                        페이지 추가
                      </Button>
                    )}
                  </div>
                }
              />
            )}
            {pages !== false && pages.length > 0 && (
              <div
                ref={this.pageList}
                className={`page-list ${selectedPageList ? 'selected' : ''}`}
                onClick={() => {
                  this.setSelectedPageId(null);
                }}
                onMouseEnter={() => {
                  this.pageListMouseHover = true;
                }}
                onMouseLeave={() => {
                  this.pageListMouseHover = false;
                }}
              >
                <div className="scrollbar">
                  <PageCardLayoutList
                    pages={pages}
                    movePage={this.movePage}
                    updatePageOrders={this.updatePageOrders}
                    updatePageTitle={this.updatePageTitle}
                    deletePage={this.deletePage}
                    onPageClick={this.setSelectedPageId}
                    selectedId={selectedPageId}
                    isWriter
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="page-editor">
          <PageEditor
            onRef={
              /* eslint-disable-next-line no-return-assign */
              (ref) => (this.pageEditorRef = ref)
            }
            createPage={this.createPage}
            showPageList={showPageList}
            setShowPageList={this.setShowPageList}
            topicId={topicId}
            topic={topic}
            chapterId={chapterId}
            chapter={chapter}
            pageId={selectedPageId}
            page={pages ? pages.find((d) => d.id === selectedPageId) : {}}
            setPageContent={this.setPageContent}
            setPageDirty={this.setPageDirty}
            updatePage={this.updatePage}
            updateTopicContent={this.updateTopicContent}
            updateChapterContent={this.updateChapterContent}
          />
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
      chapterId: PropTypes.string,
    }),
  }),
};

export default withRouter(withTranslation()(Page));
