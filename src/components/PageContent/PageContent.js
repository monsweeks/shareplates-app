import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { getItem } from '@/components/PageContentItems';
import './PageContent.scss';

class PageContent extends React.PureComponent {


  render() {
    const {
      className,
      content,
      selectedItemId,
      setSelectedItem,
      editable,
      onChangeValue,
      onChangeFile,
      setEditing,
      movePage,
    } = this.props;

    const { dragging, draggingItemId, draggingItemIndex, setDragging, moveItem, } = this.props;

    let items = [];

    if (content) {
      items = content.items;
    }

    return (
      <div
        className={`page-content-wrapper ${editable ? 'editable' : ''} ${editable ? 'g-no-select' : ''} ${className}`}
        onClick={() => {
          if (editable) {
            setSelectedItem(null, {});
          }
        }}
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
        <div>
          {items.map((item, inx) => {
            const selected = item.id === selectedItemId;
            return (
              <div className={`page-item ${selected ? 'selected' : ''}`} key={item.id}>
                {React.createElement(getItem(item.name), {
                  item,
                  itemIndex: inx,
                  editable,
                  selected,
                  setSelectedItem,
                  showLayout: dragging,
                  onChangeValue,
                  onChangeFile,
                  setEditing,
                  setDragging,
                  draggingItemId,
                  draggingItemIndex,
                  moveItem,
                })}
              </div>
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
  selectedItemId: PropTypes.string,
  setSelectedItem: PropTypes.func,
  onChangeValue: PropTypes.func,
  onChangeFile: PropTypes.func,
  editable: PropTypes.bool,
  setEditing: PropTypes.func,
  movePage: PropTypes.func,
  moveItem : PropTypes.func,
  dragging : PropTypes.bool,
  draggingItemId : PropTypes.string,
  draggingItemIndex : PropTypes.number,
  setDragging : PropTypes.func,
};

export default withRouter(withTranslation()(PageContent));
