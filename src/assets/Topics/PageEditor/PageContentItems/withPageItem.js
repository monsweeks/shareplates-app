/* eslint-disable */
import React from 'react';
import './withPageItem.scss';
import { getSize } from '@/assets/Topics/PageEditor/PageContentItems/util';

const withPageItem = () => (WrappedComponent) => {
  return class extends React.Component {
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

    sizerType = '';

    startHeight = null;

    static itemName = WrappedComponent.name;

    static setting = WrappedComponent.setting;

    stopPropagation = (e) => {
      const { editable } = this.state;
      if (editable) {
        e.stopPropagation();
      }
    };

    getPercentSize = (val, total) => {
      return Math.round((val / total) * 10000) / 100;
    };

    onDragStart = (id) => {
      const { setDragging, itemIndex } = this.props;
      setDragging(true, id, itemIndex);
    };

    onDragEnd = () => {
      const { draggingItemId, setDragging, checkDirty } = this.props;
      if (draggingItemId) {
        setDragging(false);
        this.setState({
          draggable: false,
        });
        checkDirty();
      }
    };

    onDragOver = (id, e) => {
      e.stopPropagation();
      e.preventDefault();

      const { itemIndex, draggingItemId, draggingItemIndex, moveItem, lastMovedItemId } = this.props;

      if (draggingItemId && draggingItemId !== id && lastMovedItemId !== id) {
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
      this.startHeight = this.control.current.clientHeight;
      this.sizerType = sizerType;
    };

    onSizerDoubleClick = (sizerType) => {
      const {
        onChangeOption,
        item: { options },
      } = this.props;

      if ((sizerType === 'bottom' && options.wrapperHeight !== 100) || options.wrapperHeightUnit !== '%') {
        onChangeOption(
          {
            wrapperHeight: 100,
            wrapperHeightUnit: '%',
          },
          null,
          true,
        );
      }
    };

    onSizerMouseUp = () => {
      const {
        onChangeOption,
        item: { options },
      } = this.props;

      const parentHeight = Number.parseFloat(this.control.current.parentNode.clientHeight);
      const height = Number.parseFloat(this.control.current.clientHeight);
      const wrapperHeight = options.wrapperHeightUnit === '%' ? this.getPercentSize(height, parentHeight) : height;
      const wrapperHeightUnit = options.wrapperHeightUnit === '%' ? '%' : 'px';

      if (
        (this.sizerType === 'bottom' && options.wrapperHeight !== wrapperHeight) ||
        options.wrapperHeightUnit !== wrapperHeightUnit
      ) {
        onChangeOption(
          {
            wrapperHeight,
            wrapperHeightUnit,
          },
          null,
          true,
        );
      }

      document.removeEventListener('mousemove', this.onSizerMouseMove);
      document.removeEventListener('mouseup', this.onSizerMouseUp);

      this.startX = null;
      this.startY = null;
      this.startHeight = null;
      this.sizerType = '';
    };

    onSizerMouseMove = (e) => {
      if (this.sizerType === 'bottom') {
        this.control.current.style.height = this.startHeight + (e.clientY - this.startY) + 'px';
      }
    };

    clearTextSelection = () => {
      if (window.getSelection) {
        if (window.getSelection().empty) {
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {
        document.selection.empty();
      }
    };

    render() {
      const { editable, draggable } = this.state;
      const { item, selected, setSelectedItem, childSelectedList, setChildSelectedInfo, showLayout } = this.props;
      const { draggingItemId, removeItem } = this.props;
      const { wrapperWidth, wrapperHeight, wrapperWidthUnit, wrapperHeightUnit } = item.options;
      const { pointer, onPointer } = this.props;

      return (
        <div
          ref={this.control}
          className={`page-item with-page-item-wrapper ${editable ? 'editable' : ''} 
                                             ${selected ? 'selected' : ''} 
                                             ${showLayout ? 'show-layout' : ''}
                                             ${item && item.id === draggingItemId ? 'dragging' : ''}`}
          style={{
            width: getSize(wrapperWidth, wrapperWidthUnit),
            height: getSize(wrapperHeight, wrapperHeightUnit),
          }}
          onClick={(e) => {
            e.stopPropagation();

            if (editable && !selected) {
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
          <div
            className="remove-item-button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(null, {});
              setChildSelectedInfo(null, null);
              removeItem(item.id);
            }}
          >
            <i className="fal fa-times" />
          </div>
          <div className="grab grab-top" onMouseDown={this.onGrabMouseDown} onMouseUp={this.onGrabMouseUp} />
          <div className="grab grab-right" onMouseDown={this.onGrabMouseDown} onMouseUp={this.onGrabMouseUp} />
          <div className="grab grab-bottom" onMouseDown={this.onGrabMouseDown} onMouseUp={this.onGrabMouseUp} />
          <div className="grab grab-left" onMouseDown={this.onGrabMouseDown} onMouseUp={this.onGrabMouseUp} />
          <div
            className="sizer bottom"
            onMouseDown={(e) => {
              this.onSizerMouseDown('bottom', e);
            }}
            onDoubleClick={() => {
              this.onSizerDoubleClick('bottom');
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
              selected={selected}
              setSelectedItem={setSelectedItem}
              childSelectedList={childSelectedList}
              setChildSelectedInfo={setChildSelectedInfo}
              clearTextSelection={this.clearTextSelection}
              onPointer={onPointer}
              pointer={pointer}
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
  width: 'width',
  widthUnit: 'widthUnit',
  height: 'height',
  heightUnit: 'heightUnit',
  keepingRatio: 'keepingRatio',
  wrapperHeight: 'wrapperHeight',
  wrapperHeightUnit: 'wrapperHeightUnit',
  borderRadius: 'borderRadius',
  borderRadiusUnit: 'borderRadiusUnit',
  listStyle: 'listStyle',
  indentLevel: 'indentLevel',
  fontWeight: 'fontWeight',
  textDecorationLine: 'textDecorationLine',
  textDecorationStyle: 'textDecorationStyle',
  textDecorationColor: 'textDecorationColor',
};

export default withPageItem;
