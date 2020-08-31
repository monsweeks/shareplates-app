import React from 'react';
import PropTypes from 'prop-types';
import withPageItem from '@/assets/Topics/PageEditor/PageContentItems/withPageItem';
import { Button } from '@/components';
import request from '@/utils/request';
import './Image.scss';
import { PointerPropTypes } from '@/proptypes';

class Image extends React.PureComponent {
  control = React.createRef();

  fileInput = React.createRef();

  img = React.createRef();

  grabPosition = false;

  startX = null;

  startY = null;

  startWidth = null;

  startHeight = null;

  resizeType = '';

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      uuid: null,
      edit: false,
      dragging: false,
      cursor: '',
      resizing: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.values && props.values.id !== state.id) {
      return {
        id: props.values.id,
        uuid: props.values.uuid,
      };
    }

    return null;
  }

  onOutsideClick = (e) => {
    const { setEditing } = this.props;

    if (this.control.current && !this.control.current.contains(e.target)) {
      this.setState({
        edit: false,
      });
      setEditing(false);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { edit } = this.state;
    if (!prevState.edit && edit) {
      document.addEventListener('mousedown', this.onOutsideClick);
    }

    if (prevState.edit && !edit) {
      document.removeEventListener('mousedown', this.onOutsideClick);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideClick);
  }

  getTextAlign = (textAlign) => {
    switch (textAlign) {
      case 'left': {
        return 'flex-start';
      }

      case 'right': {
        return 'flex-end';
      }

      default: {
        return textAlign;
      }
    }
  };

  onDragOver = (e) => {
    const { dragging } = this.state;
    e.stopPropagation();
    e.preventDefault();

    if (!dragging) {
      this.setState({
        dragging: true,
      });
    }
  };

  onDragLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      dragging: false,
    });
  };

  onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { onChangeFile, setSelectedItem, item } = this.props;

    if (e.dataTransfer.files.length > 0) {
      setSelectedItem(item.id, item.options);
      onChangeFile(e.dataTransfer.files[0], item.id);
    }
  };

  setImgSize = () => {
    const {
      onChangeOption,
      item: { options },
    } = this.props;
    if (
      options.naturalWidth !== this.img.current.naturalWidth ||
      options.naturalHeight !== this.img.current.naturalHeight
    ) {
      onChangeOption({
        naturalWidth: this.img.current.naturalWidth,
        naturalHeight: this.img.current.naturalHeight,
        ratio: this.img.current.naturalHeight / this.img.current.naturalWidth,
      });
    }
  };

  onMouseSizeChange = (e) => {
    const {
      style: { keepingRatio },
      item: { options },
    } = this.props;

    const ratio = options.ratio || 1;

    switch (this.resizeType) {
      case 'right-top': {
        const width = this.startWidth + (e.clientX - this.startX);
        if (keepingRatio === 'Y') {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${width * ratio}px`;
        } else {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${this.startHeight + (this.startY - e.clientY)}px`;
        }
        break;
      }

      case 'right-bottom': {
        const width = this.startWidth + (e.clientX - this.startX);
        if (keepingRatio === 'Y') {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${width * ratio}px`;
        } else {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${this.startHeight + (e.clientY - this.startY)}px`;
        }
        break;
      }

      case 'left-top': {
        const width = this.startWidth + (this.startX - e.clientX);
        if (keepingRatio === 'Y') {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${width * ratio}px`;
        } else {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${this.startHeight + (this.startY - e.clientY)}px`;
        }
        break;
      }

      case 'left-bottom': {
        const width = this.startWidth + (this.startX - e.clientX);
        if (keepingRatio === 'Y') {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${width * ratio}px`;
        } else {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${this.startHeight + (e.clientY - this.startY)}px`;
        }
        break;
      }

      case 'right': {
        const width = this.startWidth + (e.clientX - this.startX);
        if (keepingRatio === 'Y') {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${width * ratio}px`;
        } else {
          this.img.current.style.width = `${width}px`;
        }
        break;
      }

      case 'left': {
        const width = this.startWidth + (this.startX - e.clientX);
        if (keepingRatio === 'Y') {
          this.img.current.style.width = `${width}px`;
          this.img.current.style.height = `${width * ratio}px`;
        } else {
          this.img.current.style.width = `${width}px`;
        }
        break;
      }

      case 'top': {
        const height = this.startHeight + (this.startY - e.clientY);
        if (keepingRatio === 'Y') {
          this.img.current.style.width = `${height * (1 / ratio)}px`;
          this.img.current.style.height = `${height}px`;
        } else {
          this.img.current.style.height = `${height}px`;
        }
        break;
      }

      case 'bottom': {
        const height = this.startHeight + (e.clientY - this.startY);
        if (keepingRatio === 'Y') {
          this.img.current.style.width = `${height * (1 / ratio)}px`;
          this.img.current.style.height = `${height}px`;
        } else {
          this.img.current.style.height = `${height}px`;
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  onMouseMove = (e) => {
    e.stopPropagation();
    const { cursor, resizing } = this.state;
    if (resizing) {
      return;
    }

    const rect = e.target.getBoundingClientRect();
    const { width, height } = rect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const grabMargin = 10;

    let nextCursor = '';

    let left = false;
    let right = false;
    let top = false;
    let bottom = false;
    if (x > 0 && x < grabMargin) {
      left = true;
    }
    if (x > width - grabMargin && x < width) {
      right = true;
    }
    if (y > 0 && y < grabMargin) {
      top = true;
    }
    if (y > height - grabMargin && y < height) {
      bottom = true;
    }

    let vertical = false;
    let horizontal = false;

    if (left || right || top || bottom) {
      this.grabPosition = true;

      if (top || bottom) {
        vertical = true;
      }

      if (left || right) {
        horizontal = true;
      }

      if (vertical && horizontal) {
        if (left && top) {
          nextCursor = 'nw-resize';
          this.resizeType = 'left-top';
        } else if (right && top) {
          nextCursor = 'ne-resize';
          this.resizeType = 'right-top';
        } else if (left && bottom) {
          nextCursor = 'ne-resize';
          this.resizeType = 'left-bottom';
        } else if (right && bottom) {
          nextCursor = 'nw-resize';
          this.resizeType = 'right-bottom';
        }
      } else if (vertical) {
        nextCursor = 'n-resize';
        if (top) {
          this.resizeType = 'top';
        } else {
          this.resizeType = 'bottom';
        }
      } else if (horizontal) {
        nextCursor = 'e-resize';
        if (left) {
          this.resizeType = 'left';
        } else {
          this.resizeType = 'right';
        }
      }

      if (cursor !== nextCursor) {
        this.setState({
          cursor: nextCursor,
        });
      }
    } else if (cursor !== '') {
      this.grabPosition = false;
      this.setState({
        cursor: '',
      });
    }
  };

  onMouseDown = (e) => {
    e.stopPropagation();
    if (this.grabPosition) {
      const { item, setSelectedItem, selected } = this.props;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.startWidth = this.img.current.clientWidth;
      this.startHeight = this.img.current.clientHeight;

      document.addEventListener('mousemove', this.onMouseSizeChange);
      document.addEventListener('mouseup', this.onMouseUp);

      if (!selected) {
        setSelectedItem(item.id, item.options);
      }

      this.setState({
        resizing: true,
      });
    }
  };

  getPercentSize = (val, total) => {
    return Math.round((val / total) * 10000) / 100;
  };

  onMouseUp = () => {
    const { resizing } = this.state;
    const {
      onChangeOption,
      item: { options },
    } = this.props;

    document.removeEventListener('mousemove', this.onMouseSizeChange);
    document.removeEventListener('mouseup', this.onMouseUp);

    if (resizing) {
      this.startX = null;
      this.startY = null;
      this.startWidth = null;
      this.startHeight = null;
      this.resizeType = '';

      const parentWidth = Number.parseFloat(this.img.current.parentNode.clientWidth);
      const parentHeight = Number.parseFloat(this.img.current.parentNode.clientHeight);

      const clientWidth = Number.parseFloat(this.img.current.clientWidth);
      const clientHeight = Number.parseFloat(this.img.current.clientHeight);

      const width = options.widthUnit === '%' ? this.getPercentSize(clientWidth, parentWidth) : clientWidth;
      const height = options.heightUnit === '%' ? this.getPercentSize(clientHeight, parentHeight) : clientHeight;

      const widthUnit = options.widthUnit === '%' ? '%' : 'px';
      const heightUnit = options.heightUnit === '%' ? '%' : 'px';

      onChangeOption({
        height,
        widthUnit,
        width,
        heightUnit,
      });

      this.setState({
        resizing: false,
      });
    }
  };

  render() {
    const { className, item, style, editable, setEditing, onChangeFile, pointer, onPointer } = this.props;
    const { id, uuid, edit, dragging, cursor } = this.state;
    const {
      alignSelf,
      textAlign,
      width,
      height,
      widthUnit,
      heightUnit,
      keepingRatio,
      borderRadius,
      borderRadiusUnit,
      ...last
    } = style;

    return (
      <div
        ref={this.control}
        className={`image-wrapper ${className} ${editable ? 'editable' : ''} ${
          pointer && String(pointer.itemId) === String(item.id) && pointer.index1 === null
            ? `g-pointed g-${pointer.style} g-${pointer.color}`
            : ''
        }`}
        {...item}
        style={last}
        onClick={() => {
          if (onPointer) {
            onPointer(item.id, null, null);
          }

          if (editable && edit) {
            this.setState({
              edit: false,
            });
            setEditing(false);
          }
        }}
      >
        {!id && (
          <div>
            <div
              className={`image-selector ${dragging ? 'dragging' : ''}`}
              onDragOver={this.onDragOver}
              onDragLeave={this.onDragLeave}
              onDrop={this.onDrop}
            >
              <div>
                <input
                  ref={this.fileInput}
                  type="file"
                  className="d-none"
                  onChange={() => {
                    if (this.fileInput.current.files.length > 0) {
                      onChangeFile(this.fileInput.current.files[0], item.id);
                    }
                  }}
                />
                <Button
                  className="image-select-button"
                  size="sm"
                  color="primary"
                  onClick={() => {
                    this.fileInput.current.click();
                  }}
                >
                  파일 선택
                </Button>
                <div className="message">
                  위 버튼을 클릭하여, 이미지 파일을 선택하거나, 여기로 파일을 드래그해주세요
                </div>
              </div>
            </div>
          </div>
        )}
        {id && (
          <div
            style={{
              justifyContent: this.getTextAlign(textAlign),
            }}
          >
            <img
              draggable={false}
              onDragStart={(e) => e.stopPropagation()}
              onDragOver={(e) => e.stopPropagation()}
              className="img-control"
              ref={this.img}
              style={{
                cursor,
                alignSelf,
                width: width === 'auto' ? width : width + widthUnit,
                height: height === 'auto' ? height : height + heightUnit,
                borderRadius: borderRadius + borderRadiusUnit,
              }}
              src={`${request.getBase()}/api/files/${id}?uuid=${uuid}`}
              alt=""
              onLoad={() => {
                this.setImgSize();
              }}
              onMouseMove={editable ? this.onMouseMove : null}
              onMouseDown={editable ? this.onMouseDown : null}
              onMouseUp={editable ? this.onMouseUp : null}
            />
          </div>
        )}
      </div>
    );
  }
}

Image.defaultProps = {
  className: '',
};

Image.propTypes = {
  className: PropTypes.string,
  item: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  values: PropTypes.objectOf(PropTypes.any),
  editable: PropTypes.bool,
  onChangeFile: PropTypes.func,
  setEditing: PropTypes.func,
  setSelectedItem: PropTypes.func,
  onChangeOption: PropTypes.func,
  selected: PropTypes.bool,
  pointer: PointerPropTypes,
  onPointer: PropTypes.func,
};

// 편집 가능한 옵션과 그 옵션들의 기본값 세팅
const pageItemProps = {};
pageItemProps[withPageItem.options.textAlign] = 'center';
pageItemProps[withPageItem.options.backgroundColor] = 'inherit';
pageItemProps[withPageItem.options.alignSelf] = 'center';
pageItemProps[withPageItem.options.padding] = '0rem 0rem 0rem 0rem';
pageItemProps[withPageItem.options.border] = 'none';
pageItemProps[withPageItem.options.backgroundSize] = 'contain';
pageItemProps[withPageItem.options.width] = 'auto';
pageItemProps[withPageItem.options.widthUnit] = '%';
pageItemProps[withPageItem.options.height] = '100';
pageItemProps[withPageItem.options.heightUnit] = '%';
pageItemProps[withPageItem.options.keepingRatio] = 'Y';
pageItemProps[withPageItem.options.naturalWidth] = '';
pageItemProps[withPageItem.options.naturalHeight] = '';
pageItemProps[withPageItem.options.ratio] = '';
pageItemProps[withPageItem.options.borderRadius] = '0';
pageItemProps[withPageItem.options.borderRadiusUnit] = 'px';

pageItemProps[withPageItem.options.wrapperHeight] = 'auto';
pageItemProps[withPageItem.options.wrapperHeightUnit] = 'px';

// 이 컴포넌트에서 사용하는 컨텐츠 관련 속성
const pageItemValues = {};
pageItemValues.id = null;
pageItemValues.uuid = null;

Image.setting = {
  pageItemProps,
  pageItemValues,
};

export default withPageItem()(Image);
