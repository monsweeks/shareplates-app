import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageContent, PageController } from '@/components';
import './PageEditor.scss';
import { getSetting } from '@/components/PageContentItems';
import request from '@/utils/request';

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
      lastMovedItemId : null,
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
      lastMovedItemId : destItemId,
    });

    console.log(destItemId);
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

  onChangeOption = (optionKey, optionValue) => {
    const { selectedItemId, content } = this.state;
    if (selectedItemId) {
      if (typeof optionKey === 'object') {


        const next = { ...content };
        const item = next.items.find((i) => i.id === selectedItemId);
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
      } else {
        const next = { ...content };
        const item = next.items.find((i) => i.id === selectedItemId);
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
    const { className, updatePage, setPageContent, pageId, ...last } = this.props;
    const { content, selectedItemId, itemOptions, editing } = this.state;
    const { dragging, draggingItemId, draggingItemIndex, lastMovedItemId } = this.state;

    return (
      <div className={`page-editor-wrapper g-no-select ${className}`}>
        <PageController
          pageId={pageId}
          className="property-manager"
          addItem={this.addItem}
          {...last}
          updateContent={this.updateContent}
          itemOptions={itemOptions}
          pageProperties={content.pageProperties || {}}
          onChangeOption={this.onChangeOption}
          onChangePageProperties={this.onChangePageProperties}
          selectedItemId={selectedItemId}
          setEditing={this.setEditing}
        />
        <div className="editor-content">
          <PageContent
            pageId={pageId}
            content={content}
            setPageContent={this.setPageContent}
            selectedItemId={selectedItemId}
            setSelectedItem={this.setSelectedItem}
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
  chapterId: PropTypes.number,
  pageId: PropTypes.number,
  page: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  setPageDirty: PropTypes.func,
  updatePage: PropTypes.func,
  showPageList: PropTypes.bool,
  moveItem: PropTypes.func,
  onRef : PropTypes.func,
};

export default withRouter(PageEditor);
