import React from 'react';
import PropTypes from 'prop-types';
import './Image.scss';
import withPageItem from '@/components/PageContentItems/withPageItem';
import { Button } from '@/components';
import request from '@/utils/request';

class Image extends React.Component {
  control = React.createRef();

  fileInput = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      uuid: null,
      edit: false,
      dragging: false,
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

  getVerticalAlign = (alignSelf) => {
    switch (alignSelf) {
      case 'baseline': {
        return 'top';
      }

      case 'flex-end': {
        return 'bottom';
      }

      default: {
        return alignSelf;
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

  render() {
    const { className, item, style, editable, setEditing, onChangeFile } = this.props;
    const { id, uuid, edit, dragging } = this.state;
    const { alignSelf, textAlign, backgroundSize, ...last } = style;

    return (
      <div
        ref={this.control}
        className={`image-wrapper ${className} ${editable ? 'editable' : ''}`}
        {...item}
        style={last}
        onClick={() => {
          if (editable && edit) {
            this.setState({
              edit: false,
            });
            setEditing(false);
          }
        }}
      >
        <div>
          {!id && (
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
          )}
          {id && <img src={`${request.getBase()}/files/${id}?uuid=${uuid}`} alt="" className="d-none" />}
          {id && (
            <div
              className="img-div"
              style={{
                backgroundImage: `url(${request.getBase()}/files/${id}?uuid=${uuid})`,
                backgroundPosition: `${this.getVerticalAlign(alignSelf)} ${textAlign}`,
                backgroundSize,
              }}
            />
          )}
        </div>
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
};

// 편집 가능한 옵션과 그 옵션들의 기본값 세팅
const pageItemProps = {};
pageItemProps[withPageItem.options.textAlign] = 'center';
pageItemProps[withPageItem.options.backgroundColor] = 'transparent';
pageItemProps[withPageItem.options.alignSelf] = 'center';
pageItemProps[withPageItem.options.padding] = '0rem 0rem 0rem 0rem';
pageItemProps[withPageItem.options.border] = 'none';
pageItemProps[withPageItem.options.backgroundSize] = 'contain';

// 이 컴포넌트에서 사용하는 컨텐츠 관련 속성
const pageItemValues = {};
pageItemValues.id = null;
pageItemValues.uuid = null;

Image.setting = {
  w: 120,
  h: 4,
  pageItemProps,
  pageItemValues,
};

export default withPageItem()(Image);
