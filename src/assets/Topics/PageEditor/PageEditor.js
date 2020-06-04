import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageController from './PageController/PageController';
import { PageContent } from '@/assets';
import { getSetting } from '@/assets/Topics/PageEditor/PageContentItems';
import request from '@/utils/request';
import './PageEditor.scss';

const defaultContent = {
  items: [],
  pageProperties: {},
};

class PageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: JSON.parse(JSON.stringify(defaultContent)),
      originalContent: null,
      pageId: -1,
      selectedItemId: null,
      childSelectedList: null,
      itemOptions: {},
      editing: false,
      dragging: false,
      draggingItemId: null,
      draggingItemIndex: null,
      lastMovedItemId: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.pageId && props.pageId !== state.pageId) {
      const content = props.page.content ? JSON.parse(props.page.content) : JSON.parse(JSON.stringify(defaultContent));

      return {
        pageId: props.pageId,
        content,
        originalContent: JSON.stringify(content),
      };
    }

    if (!props.pageId && state.pageId) {
      return {
        content: JSON.parse(JSON.stringify(defaultContent)),
        originalContent: null,
        pageId: -1,
        selectedItemId: null,
        itemOptions: {},
        pageProperties: {},
        editing: false,
      };
    }

    return null;
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    onRef(undefined);
  }

  removeItem = (itemId) => {
    const { content } = this.state;
    if (itemId) {
      const next = { ...content };
      const itemInx = next.items.findIndex((item) => item.id === itemId);
      if (itemInx > -1) {
        next.items.splice(itemInx, 1);
      }

      this.setState(
        {
          content: next,
        },
        () => {
          this.checkDirty();
        },
      );
    }
  };

  checkDirty = () => {
    const { pageId, setPageDirty } = this.props;
    const { content, originalContent } = this.state;
    setPageDirty(pageId, JSON.stringify(content) !== originalContent);
  };

  setPageContent = () => {
    const { setPageContent } = this.props;
    const { pageId, content } = this.state;
    setPageContent(pageId, content);
  };

  addItem = (name) => {
    const setting = getSetting(name);
    const { pageId, content } = this.state;
    const next = { ...content };
    const id = String(new Date().getTime());

    if (pageId && pageId > -1) {
      next.items.push({
        id,
        name,
        options: { ...setting.pageItemProps },
        values: { ...setting.pageItemValues },
      });

      this.setState(
        {
          content: next,
        },
        () => {
          this.checkDirty();
        },
      );
    }
  };

  setDragging = (dragging, draggingItemId, draggingItemIndex) => {
    this.setState({
      dragging,
      draggingItemId,
      draggingItemIndex,
      lastMovedItemId: null,
    });
  };

  moveItem = (targetItemId, destItemId, right) => {
    if (targetItemId === destItemId) {
      return;
    }

    const { content } = this.state;
    const next = content.items.slice(0);

    const targetIndex = next.findIndex((item) => item.id === targetItemId);
    const target = next[targetIndex];
    next.splice(targetIndex, 1);

    const destIndex = next.findIndex((item) => item.id === destItemId);
    const nextIndex = destIndex + (right ? 1 : 0);
    next.splice(nextIndex, 0, target);

    this.setState({
      content: {
        items: next,
      },
      draggingItemIndex: nextIndex,
      lastMovedItemId: destItemId,
    });
  };

  updateContent = () => {
    const { updatePage } = this.props;
    const { pageId, content } = this.state;
    updatePage(pageId, JSON.stringify(content));
  };

  setSelectedItem = (selectedItemId, itemOptions) => {
    this.setState({
      selectedItemId,
      itemOptions,
    });
  };

  setChildSelectedInfo = (childSelectedInfo, type) => {
    if (!childSelectedInfo) {
      this.setState({
        childSelectedList: null,
      });
      return;
    }

    const { childSelectedList } = this.state;
    let next = childSelectedList ? childSelectedList.slice(0) : [];
    if (type === 'click') {
      next = [childSelectedInfo];
    } else if (type === 'ctrl') {
      const findIndex = next.findIndex((info) => JSON.stringify(info) === JSON.stringify(childSelectedInfo));
      if (findIndex > -1) {
        next.splice(findIndex, 1);
      } else {
        next.push(childSelectedInfo);
      }
    } else if (type === 'alt') {
      const findIndex = next.findIndex((info) => JSON.stringify(info) === JSON.stringify(childSelectedInfo));
      if (findIndex > -1) {
        next.splice(findIndex, 1);
      }
    } else if (type === 'shift') {
      next = childSelectedInfo;
    }

    this.setState({
      childSelectedList: next.sort((a, b) => {
        return JSON.stringify(a).localeCompare(JSON.stringify(b));
      }),
    });
  };

  onChangeOption = (optionKey, optionValue) => {
    const { selectedItemId, content, childSelectedList } = this.state;

    if (selectedItemId) {
      if (typeof optionKey === 'object') {
        const next = { ...content };
        const item = next.items.find((i) => i.id === selectedItemId);

        if (item.name === 'Table' && childSelectedList && childSelectedList.length > 0) {
          for (let i = 0; i < childSelectedList.length; i += 1) {
            const options = { ...item.values.rows[childSelectedList[i][0]].cols[childSelectedList[i][1]].options };

            Object.keys(optionKey).forEach((key) => {
              if (key.indexOf('wrapper') !== 0) {
                options[key] = optionKey[key];
              }
            });

            item.values.rows[childSelectedList[i][0]].cols[childSelectedList[i][1]].options = options;
          }

          this.setState(
            {
              content: next,
            },
            () => {
              this.checkDirty();
            },
          );
        } else {
          const options = { ...item.options };

          Object.keys(optionKey).forEach((key) => {
            options[key] = optionKey[key];
          });

          item.options = options;
          this.setState(
            {
              content: next,
              itemOptions: options,
            },
            () => {
              this.checkDirty();
            },
          );
        }
      } else {
        const next = { ...content };
        const item = next.items.find((i) => i.id === selectedItemId);

        if (item.name === 'Table' && childSelectedList && childSelectedList.length > 0) {
          for (let i = 0; i < childSelectedList.length; i += 1) {
            if (optionKey.indexOf('wrapper') !== 0) {
              const options = { ...item.values.rows[childSelectedList[i][0]].cols[childSelectedList[i][1]].options };
              options[optionKey] = optionValue;
              item.values.rows[childSelectedList[i][0]].cols[childSelectedList[i][1]].options = options;
            }
          }

          this.setState(
            {
              content: next,
            },
            () => {
              this.checkDirty();
            },
          );
        } else {
          const options = { ...item.options };
          options[optionKey] = optionValue;
          item.options = options;
          this.setState(
            {
              content: next,
              itemOptions: options,
            },
            () => {
              this.checkDirty();
            },
          );
        }
      }
    }
  };

  onChangeValue = (obj) => {
    const { selectedItemId, content } = this.state;
    if (selectedItemId) {
      const next = { ...content };
      const item = next.items.find((i) => i.id === selectedItemId);
      const values = { ...item.values };

      Object.keys(obj).forEach((key) => {
        values[key] = obj[key];
      });

      item.values = values;
      this.setState(
        {
          content: next,
        },
        () => {
          this.checkDirty();
        },
      );
    }
  };

  onChangeTopicProperties = (key, value) => {
    const { topicId, updateTopicContent } = this.props;
    const { topic } = this.props;
    if (topicId) {
      const next = { ...topic };
      const topicProperties = next.content && next.content.topicProperties ? next.content.topicProperties : {};

      topicProperties[key] = value;
      if (!next.content) {
        next.content = {};
      }

      next.content.topicProperties = topicProperties;
      updateTopicContent(JSON.stringify(next.content));
    }
  };

  onChangeChapterProperties = (key, value) => {
    const { chapterId, updateChapterContent } = this.props;
    const { chapter } = this.props;
    if (chapterId) {
      const next = { ...chapter };
      const chapterProperties = next.content && next.content.chapterProperties ? next.content.chapterProperties : {};

      chapterProperties[key] = value;
      if (!next.content) {
        next.content = {};
      }
      next.content.chapterProperties = chapterProperties;

      updateChapterContent(JSON.stringify(next.content));
    }
  };

  onChangePageProperties = (key, value) => {
    const { pageId } = this.props;
    const { content } = this.state;
    if (pageId) {
      const next = { ...content };
      const pageProperties = { ...next.pageProperties };

      pageProperties[key] = value;
      next.pageProperties = pageProperties;

      this.setState(
        {
          content: next,
        },
        () => {
          this.checkDirty();
        },
      );
    }
  };

  getFileType = (file) => {
    if (!/^image\//.test(file.type)) {
      return 'image';
    }
    if (!/^video\//.test(file.type)) {
      return 'video';
    }
    return 'file';
  };

  onChangeFile = (file, itemId) => {
    const { topicId, chapterId, pageId } = this.props;
    const { selectedItemId, content } = this.state;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('size', file.size);
    formData.append('type', this.getFileType(file));

    request.post(`/api/topics/${topicId}/chapters/${chapterId}/pages/${pageId}/file`, formData, (data) => {
      if (itemId || selectedItemId) {
        const next = { ...content };
        const item = next.items.find((i) => i.id === (itemId || selectedItemId));

        const values = { ...item.values };
        values.id = data.id;
        values.uuid = data.uuid;
        item.values = values;

        this.setState(
          {
            content: next,
          },
          () => {
            this.checkDirty();
          },
        );
      }
    });
  };

  setEditing = (editing) => {
    this.setState({
      editing,
    });
  };

  render() {
    const { className, updatePage, setPageContent, topicId, chapterId, pageId, ...last } = this.props;
    const { topic, chapter } = this.props;
    const { content, selectedItemId, childSelectedList, itemOptions, editing } = this.state;
    const { dragging, draggingItemId, draggingItemIndex, lastMovedItemId } = this.state;

    return (
      <div className={`page-editor-wrapper g-no-select ${className}`}>
        <PageController
          topicId={topicId}
          chapterId={chapterId}
          pageId={pageId}
          className="property-manager"
          addItem={this.addItem}
          {...last}
          updateContent={this.updateContent}
          itemOptions={itemOptions}
          topicProperties={topic.content ? topic.content.topicProperties : {}}
          chapterProperties={chapter.content ? chapter.content.chapterProperties : {}}
          pageProperties={content.pageProperties || {}}
          onChangeOption={this.onChangeOption}
          onChangeTopicProperties={this.onChangeTopicProperties}
          onChangeChapterProperties={this.onChangeChapterProperties}
          onChangePageProperties={this.onChangePageProperties}
          selectedItemId={selectedItemId}
          childSelectedList={childSelectedList}
          setEditing={this.setEditing}
        />
        <div className="editor-content">
          <PageContent
            pageId={pageId}
            content={content}
            topicProperties={topic.content ? topic.content.topicProperties : {}}
            chapterProperties={chapter.content ? chapter.content.chapterProperties : {}}
            setPageContent={this.setPageContent}
            selectedItemId={selectedItemId}
            setSelectedItem={this.setSelectedItem}
            childSelectedList={childSelectedList}
            setChildSelectedInfo={this.setChildSelectedInfo}
            onChangeOption={this.onChangeOption}
            onChangeValue={this.onChangeValue}
            onChangeFile={this.onChangeFile}
            editable
            editing={editing}
            setEditing={this.setEditing}
            moveItem={this.moveItem}
            dragging={dragging}
            draggingItemId={draggingItemId}
            draggingItemIndex={draggingItemIndex}
            lastMovedItemId={lastMovedItemId}
            setDragging={this.setDragging}
            removeItem={this.removeItem}
          />
        </div>
      </div>
    );
  }
}

PageEditor.defaultProps = {
  className: '',
};

PageEditor.propTypes = {
  className: PropTypes.string,
  setPageContent: PropTypes.func,
  topicId: PropTypes.number,
  topic: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.objectOf(PropTypes.any),
  }),
  chapterId: PropTypes.number,
  chapter: PropTypes.shape({
    id: PropTypes.number,
    content: PropTypes.objectOf(PropTypes.any),
  }),
  pageId: PropTypes.number,
  page: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  setPageDirty: PropTypes.func,
  updatePage: PropTypes.func,
  showPageList: PropTypes.bool,
  moveItem: PropTypes.func,
  onRef: PropTypes.func,
  updateTopicContent: PropTypes.func,
  updateChapterContent: PropTypes.func,
};

export default withRouter(PageEditor);
