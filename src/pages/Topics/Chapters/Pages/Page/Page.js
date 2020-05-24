import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, EmptyMessage } from '@/components';
import request from '@/utils/request';
import { PageCardLayoutList, PageEditor, PageListTopMenu } from '@/assets';
import { setConfirm } from '@/actions';
import { PAGE_FONT_FAMILIES, PAGE_FONT_SIZES } from '@/assets/Topics/PageEditor/PageController/constants';
import './Page.scss';

class Page extends React.Component {
  pageEditorRef = React.createRef();

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
  }

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
    const content = {
      items: [],
      pageProperties: {
        fontFamily: PAGE_FONT_FAMILIES[0].value,
        fontSize: PAGE_FONT_SIZES[0].value,
        backgroundColor: 'inherit',
        color: 'inherit',
        padding: '',
      },
    };

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
    const { setConfirm: setConfirmReducer } = this.props;
    const { selectedPageId: currentSelectedPageId, pages } = this.state;

    if (currentSelectedPageId === selectedPageId) {
      return;
    }

    const next = pages.slice(0);
    const page = next.find((p) => p.id === currentSelectedPageId);
    if (page && page.dirty) {
      setConfirmReducer('변경된 페이지 내용이 저장되지 않았습니다. 그래도 다른 페이지로 이동하시겠습니까?', () => {
        page.dirty = false;
        this.setState({
          selectedPageId,
          pages: next,
        });
      });
    } else {
      this.setState({
        selectedPageId,
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
    const { topicId, topic, chapterId, chapter, pages, selectedPageId, showPageList } = this.state;
    const isWriter = true;

    return (
      <div className="page-manager-wrapper">
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
                className="page-list"
                onClick={() => {
                  this.setSelectedPageId(null);
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

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
  };
};

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
  setConfirm: PropTypes.func,
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(Page)));