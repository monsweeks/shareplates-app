import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { getItem } from '@/assets/Topics/PageEditor/PageContentItems';
import { EmptyMessage } from '@/components';
import './PageContent.scss';

class PageContent extends React.PureComponent {
  getMergedPageProperties = (topicProperties, chapterProperties, pageProperties) => {
    const properties = { ...topicProperties };

    Object.keys(chapterProperties).forEach((key) => {
      if (chapterProperties[key] && chapterProperties[key] !== 'inherit' && chapterProperties[key] !== 'transparent') {
        properties[key] = chapterProperties[key];
      }
    });

    Object.keys(pageProperties).forEach((key) => {
      if (pageProperties[key] && pageProperties[key] !== 'inherit' && pageProperties[key] !== 'transparent') {
        properties[key] = pageProperties[key];
      }
    });

    return properties;
  };

  render() {
    const {
      className,
      content,
      selectedItemId,
      setSelectedItem,
      editable,
      onChangeOption,
      onChangeValue,
      onChangeFile,
      setEditing,
      movePage,
      removeItem,
      t,
      topicProperties,
      chapterProperties,
    } = this.props;

    const { dragging, draggingItemId, draggingItemIndex, lastMovedItemId, setDragging, moveItem, pageId } = this.props;

    const items = content ? content.items : [];
    const pageProperties = pageId
      ? this.getMergedPageProperties(topicProperties, chapterProperties, content.pageProperties)
      : {};

    return (
      <div
        className={`page-content-wrapper ${editable ? 'editable' : ''} ${editable ? 'g-no-select' : ''} ${className}`}
        onClick={() => {
          if (editable) {
            setSelectedItem(null, {});
          }
        }}
        style={{ ...pageProperties }}
      >
        {!editable && (
          <>
            <div className="prev-page">
              <div
                onClick={() => {
                  movePage(false);
                }}
              >
                <i className="fal fa-chevron-left" />
              </div>
            </div>
            <div className="next-page">
              <div
                onClick={() => {
                  movePage(true);
                }}
              >
                <i className="fal fa-chevron-right" />
              </div>
            </div>
          </>
        )}
        <div className="page-content-viewer scrollbar">
          {editable && !pageId && (
            <div className="h-100 d-flex">
              <EmptyMessage
                className="h5"
                message={
                  <div>
                    <div>{t('페이지를 선택해주세요')}</div>
                  </div>
                }
              />
            </div>
          )}
          {items.map((item, inx) => {
            const selected = item.id === selectedItemId;
            return (
              <React.Fragment key={item.id}>
                {React.createElement(getItem(item.name), {
                  item,
                  itemIndex: inx,
                  editable,
                  selected,
                  setSelectedItem,
                  showLayout: dragging,
                  onChangeOption,
                  onChangeValue,
                  onChangeFile,
                  setEditing,
                  setDragging,
                  draggingItemId,
                  draggingItemIndex,
                  lastMovedItemId,
                  moveItem,
                  removeItem,
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

PageContent.defaultProps = {
  className: '',
};

PageContent.propTypes = {
  className: PropTypes.string,
  content: PropTypes.objectOf(PropTypes.any),
  topicProperties: PropTypes.objectOf(PropTypes.any),
  chapterProperties: PropTypes.objectOf(PropTypes.any),
  selectedItemId: PropTypes.string,
  setSelectedItem: PropTypes.func,
  onChangeOption: PropTypes.func,
  onChangeValue: PropTypes.func,
  onChangeFile: PropTypes.func,
  editable: PropTypes.bool,
  setEditing: PropTypes.func,
  movePage: PropTypes.func,
  moveItem: PropTypes.func,
  dragging: PropTypes.bool,
  draggingItemId: PropTypes.string,
  draggingItemIndex: PropTypes.number,
  setDragging: PropTypes.func,
  pageId: PropTypes.number,
  t: PropTypes.func,
  removeItem: PropTypes.func,
  lastMovedItemId: PropTypes.string,
};

export default withRouter(withTranslation()(PageContent));