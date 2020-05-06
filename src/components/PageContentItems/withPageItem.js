/* eslint-disable */
import React, { Component } from 'react';
import './withPageItem.scss';

const withPageItem = () => (WrappedComponent) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        editable: props.editable,
        draggable: false,
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
      this.setState({
        draggable: false,
      });
    };

    onDragOver = (id, e) => {
      e.stopPropagation();
      e.preventDefault();

      const { itemIndex, draggingItemId, draggingItemIndex, moveItem } = this.props;

      if (draggingItemId !== id) {
        moveItem(draggingItemId, id, draggingItemIndex < itemIndex);
      }
    };

    onMouseDown = () => {
      const { draggable } = this.state;
      if (!draggable) {
        this.setState({
          draggable: true,
        });
      }
    };

    onMouseUp = () => {
      const { draggable } = this.state;
      if (draggable) {
        this.setState({
          draggable: false,
        });
      }
    };

    render() {
      const { editable, draggable } = this.state;
      const { item, selected, setSelectedItem, showLayout } = this.props;
      const { draggingItemId } = this.props;

      const { wrapperWidth, wrapperHeight, wrapperWidthUnit, wrapperHeightUnit} = item.options;

      return (
        <div
          className={`page-item with-page-item-wrapper ${editable ? 'editable' : ''} 
                                             ${selected ? 'selected' : ''} 
                                             ${showLayout ? 'show-layout' : ''}
                                             ${item && item.id === draggingItemId ? 'dragging' : ''}`}
          style={{
            width: wrapperWidth === 'auto' ? wrapperWidth : wrapperWidth + wrapperWidthUnit,
            height: wrapperHeight === 'auto' ? wrapperHeight : wrapperHeight + wrapperHeightUnit,
          }}
          onClick={(e) => {
            if (editable) {
              e.stopPropagation();
              setSelectedItem(item.id, item.options);
            }
          }}
          draggable={draggable}
          onDragStart={(e) => {
            this.onDragStart(item.id, e);
          }}
          onDragEnd={this.onDragEnd}
          onDragOver={(e) => {
            this.onDragOver(item.id, e);
          }}
        >
          <div className="grab grab-top" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} />
          <div className="grab grab-right" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} />
          <div className="grab grab-bottom" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} />
          <div className="grab grab-left" onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} />
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
  wrapperWidth: 'wrapperWidth',
  wrapperWidthUnit: 'wrapperWidthUnit',
  wrapperHeight: 'wrapperHeight',
  wrapperHeightUnit: 'wrapperHeightUnit',
};

export default withPageItem;
