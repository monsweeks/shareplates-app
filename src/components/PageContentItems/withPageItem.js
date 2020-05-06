/* eslint-disable */
import React, { Component } from 'react';
import './withPageItem.scss';

const withPageItem = () => (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        editable: props.editable,
      };
    }

    static itemName = WrappedComponent.name;

    static setting = WrappedComponent.setting;

    stopPropagation = (e) => {
      const { editable } = this.state;
      if (editable) {
        e.stopPropagation();
      }
    };

    onDragStart = (id) => {
      const { setDragging, itemIndex } = this.props;
      setDragging(true, id, itemIndex);
    };

    onDragEnd = () => {
      const { setDragging } = this.props;
      setDragging(false);
    };

    onDragOver = (id, e) => {
      e.stopPropagation();
      e.preventDefault();

      const { itemIndex, draggingItemId, draggingItemIndex, moveItem } = this.props;

      if (draggingItemId !== id) {
        moveItem(draggingItemId, id, draggingItemIndex < itemIndex);
      }
    };

    render() {
      const { editable } = this.state;
      const { item, selected, setSelectedItem, showLayout } = this.props;
      const { itemIndex, draggingItemId, setDragging } = this.props;

      return (
        <div
          className={`with-page-item-wrapper ${editable ? 'editable' : ''} 
                                             ${selected ? 'selected' : ''} 
                                             ${showLayout ? 'show-layout' : ''}
                                             ${item && item.id === draggingItemId ? 'dragging' : ''}`}
          onClick={(e) => {
            if (editable) {
              e.stopPropagation();
              setSelectedItem(item.id, item.options);
            }
          }}
          draggable
          onDragStart={(e) => {
            this.onDragStart(item.id, e);
          }}
          onDragEnd={this.onDragEnd}
          onDragOver={(e) => {
            this.onDragOver(item.id, e);
          }}
        >
          <div className="grab grab-top" />
          <div className="grab grab-right" />
          <div className="grab grab-bottom" />
          <div className="grab grab-left" />
          <div className="anti-mover" onTouchStart={this.stopPropagation} onMouseDown={this.stopPropagation}>
            <WrappedComponent
              style={item.options}
              values={item.values}
              {...this.props}
              editable={editable}
              setSelectedItem={setSelectedItem}
            />
          </div>
        </div>
      );
    }
  };
};

// 아이템으로 처리 가능한 옵션들
withPageItem.options = {
  textAlign: 'textAlign',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  color: 'color',
  backgroundColor: 'backgroundColor',
  alignSelf: 'alignSelf',
  padding: 'padding',
  border: 'border',
  backgroundSize: 'backgroundSize',
};

export default withPageItem;
