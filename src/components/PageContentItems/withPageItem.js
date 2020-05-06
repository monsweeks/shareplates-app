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

    control = React.createRef();

    startX = null;

    startY = null;

    sizerType = null;

    startWidth = null;

    startheight = null;

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

    onGrabMouseDown = () => {
      const { draggable } = this.state;
      if (!draggable) {
        this.setState({
          draggable: true,
        });
      }
    };

    onGrabMouseUp = () => {
      const { draggable } = this.state;
      if (draggable) {
        this.setState({
          draggable: false,
        });
      }
    };

    onSizerMouseDown = (sizerType, e) => {
      const { item, setSelectedItem, selected } = this.props;

      document.addEventListener('mousemove', this.onSizerMouseMove);
      document.addEventListener('mouseup', this.onSizerMouseUp);

      const { draggable } = this.state;
      if (!draggable) {
        this.setState({
          draggable: false,
        });
      }

      if (!selected) {
        setSelectedItem(item.id, item.options);
      }

      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startWidth = this.control.current.clientWidth;
      this.startHeight = this.control.current.clientHeight;
      this.sizerType = sizerType;
    };

    onSizerMouseUp = () => {
      const { item, onChangeOption } = this.props;



      if (this.sizerType === 'bottom') {
        const parentHeight = Number.parseFloat(this.control.current.parentNode.clientHeight);
        const height = Number.parseFloat(this.control.current.style.height);
        onChangeOption({
          wrapperHeight: item.options.wrapperHeightUnit === '%' ? Math.round((height / parentHeight) * 10000) / 100 : height,
          wrapperHeightUnit: item.options.wrapperHeightUnit === '%' ? '%' : 'px',
        });
      } else if (this.sizerType === 'right') {
        const parentWidth = Number.parseFloat(this.control.current.parentNode.clientWidth);
        const width = Number.parseFloat(this.control.current.style.width);
        onChangeOption({
          wrapperWidth: item.options.wrapperWidthUnit === '%' ? Math.round((width / parentWidth) * 10000) / 100 : width,
          wrapperWidthUnit: item.options.wrapperWidthUnit === '%' ? '%' : 'px',
        });
      }

      document.removeEventListener('mousemove', this.onSizerMouseMove);
      document.removeEventListener('mouseup', this.onSizerMouseUp);
    };

    onSizerMouseMove = (e) => {
      switch (this.sizerType) {
        case 'bottom': {
          this.control.current.style.height = this.startHeight + (e.clientY - this.startY) + 'px';
        }
        case 'right': {
          this.control.current.style.width = this.startWidth + (e.clientX - this.startX) + 'px';
        }
      }
    };

    render() {
      const { editable, draggable } = this.state;
      const { item, selected, setSelectedItem, showLayout } = this.props;
      const { draggingItemId } = this.props;

      const { wrapperWidth, wrapperHeight, wrapperWidthUnit, wrapperHeightUnit } = item.options;

      return (
        <div
          ref={this.control}
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
          <div className="grab grab-top" onMouseDown={this.onGrabMouseDown} onMouseUp={this.onGrabMouseUp} />
          <div className="grab grab-right" onMouseDown={this.onGrabMouseDown} onMouseUp={this.onGrabMouseUp} />
          <div className="grab grab-bottom" onMouseDown={this.onGrabMouseDown} onMouseUp={this.onGrabMouseUp} />
          <div className="grab grab-left" onMouseDown={this.onGrabMouseDown} onMouseUp={this.onGrabMouseUp} />
          <div
            className="sizer bottom"
            onMouseDown={(e) => {
              this.onSizerMouseDown('bottom', e);
            }}
          >
            <span />
          </div>
          <div
            className="sizer right"
            onMouseDown={(e) => {
              this.onSizerMouseDown('right', e);
            }}
          >
            <span />
          </div>
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
