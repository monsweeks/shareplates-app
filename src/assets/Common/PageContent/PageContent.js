import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { getItem } from '@/assets/Topics/PageEditor/PageContentItems';
import { EmptyMessage } from '@/components';
import contentUtil from '@/utils/contentUtil';
import './PageContent.scss';

class PageContent extends React.PureComponent {
  render() {
    const {
      className,
      content,
      selectedItemId,
      setSelectedItem,
      childSelectedList,
      setChildSelectedInfo,
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

    const {
      dragging,
      draggingItemId,
      draggingItemIndex,
      lastMovedItemId,
      setDragging,
      moveItem,
      pageId,
      checkDirty,
    } = this.props;

    const items = content ? content.items : [];
    const pageProperties = pageId
      ? contentUtil.getMergedPageProperties(topicProperties, chapterProperties, content.pageProperties)
      : {};

    return (
      <div
        className={`page-content-wrapper ${editable ? 'editable' : ''} ${editable ? 'g-no-select' : ''} ${className}`}
        onClick={() => {
          if (editable) {
            setSelectedItem(null, {});
            setChildSelectedInfo(null, null);
          }
        }}
        style={{ ...pageProperties }}
      >
        {movePage && !editable && (
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
                  childSelectedList,
                  setChildSelectedInfo,
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
                  checkDirty,
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
  childSelectedList: PropTypes.arrayOf(PropTypes.any),
  setChildSelectedInfo: PropTypes.func,
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
  checkDirty: PropTypes.func,
};

export default withRouter(withTranslation()(PageContent));
