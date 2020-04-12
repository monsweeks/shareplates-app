import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageContent, PageController } from '@/components';
import './PageEditor.scss';
import { getSetting } from '@/components/PageContentItems';

class PageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {
        layouts: {
          lg: [],
        },
        items: [],
      },
      originalContent: null,
      pageId: -1,
      selectedItemId: null,
      itemOptions: {},
      editing: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.pageId && props.pageId !== state.pageId) {
      const content = props.page.content
        ? JSON.parse(props.page.content)
        : {
            layouts: {
              lg: [],
            },
            items: [],
          };

      return {
        pageId: props.pageId,
        content,
        originalContent: JSON.stringify(content),
      };
    }

    return null;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps) {
    const { showPageList } = this.props;
    if (showPageList !== prevProps.showPageList) {
      window.dispatchEvent(new Event('resize'));
    }
  }

  onKeyDown = (e) => {
    const { content, selectedItemId, editing } = this.state;
    if (!editing && (e.key === 'Backspace' || e.key === 'Delete') && selectedItemId) {
      const next = { ...content };

      const itemInx = next.items.findIndex((item) => item.id === selectedItemId);
      if (itemInx > -1) {
        next.items.splice(itemInx, 1);
      }

      const layoutInx = next.layouts.lg.findIndex((layout) => layout.i === selectedItemId);
      if (layoutInx > -1) {
        next.layouts.lg.splice(layoutInx, 1);
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

      if (!next.layouts.lg) {
        next.layouts.lg = [];
      }

      next.layouts.lg.push({
        i: id,
        w: setting.w,
        h: setting.h,
        x: 0,
        y: 0,
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

  updateContent = () => {
    const { updatePage } = this.props;
    const { pageId, content } = this.state;
    updatePage(pageId, JSON.stringify(content));
  };

  onLayoutChange = (layout, layouts) => {
    const { content } = this.state;
    const next = { ...content };
    next.layouts = layouts;

    this.setState(
      {
        content: next,
      },
      () => {
        this.checkDirty();
      },
    );
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

  setEditing = (editing) => {
    this.setState({
      editing,
    });
  };

  render() {
    const { className, setPageContent, ...last } = this.props;
    const { content, selectedItemId, itemOptions, editing } = this.state;

    return (
      <div className={`page-editor-wrapper g-no-select ${className}`}>
        <PageController
          className="property-manager"
          addItem={this.addItem}
          {...last}
          updateContent={this.updateContent}
          itemOptions={itemOptions}
          onChangeOption={this.onChangeOption}
          selectedItemId={selectedItemId}
        />
        <div className="editor-content">
          <PageContent
            content={content}
            setPageContent={this.setPageContent}
            onLayoutChange={this.onLayoutChange}
            selectedItemId={selectedItemId}
            setSelectedItem={this.setSelectedItem}
            onChangeValue={this.onChangeValue}
            editable
            editing={editing}
            setEditing={this.setEditing}
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
  pageId: PropTypes.number,
  page: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  setPageDirty: PropTypes.func,
  updatePage: PropTypes.func,
  showPageList : PropTypes.bool,
};

export default withRouter(PageEditor);
