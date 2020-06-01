import React from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import withPageItem from '@/assets/Topics/PageEditor/PageContentItems/withPageItem';
import './Text.scss';

class Text extends React.PureComponent {
  control = React.createRef();

  contentEditable = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      edit: false,
      height: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.edit && props.values && props.values.text) {
      return {
        text: props.values.text,
        height: props.values.height,
      };
    }

    return null;
  }

  onOutsideClick = (e) => {
    const { onChangeValue, setEditing } = this.props;
    const { text, height } = this.state;

    onChangeValue({
      text,
      height,
    });

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

  render() {
    const { className, item, style, editable, setEditing } = this.props;
    const { text, edit, height } = this.state;
    const { alignSelf, ...last } = style;

    return (
      <div
        ref={this.control}
        className={`text-wrapper ${className} ${editable ? 'editable' : ''}`}
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
        <div
          style={{
            alignSelf,
          }}
        >
          <ContentEditable
            style={{
              alignSelf,
            }}
            innerRef={this.contentEditable}
            html={text} // innerHTML of the editable div
            disabled={!edit} // use true to disable editing
            onClick={(e) => {
              if (editable && !edit) {
                this.setState({
                  edit: true,
                });
                setEditing(true);
                setTimeout(() => {
                  if (this.contentEditable.current) this.contentEditable.current.focus();
                }, 100);
              } else {
                e.stopPropagation();
              }
            }}
            onChange={(e) => {
              if (height !== e.target.scrollHeight) {
                this.setState({
                  text: e.target.value,
                  height: this.contentEditable.current.clientHeight,
                });
              } else {
                this.setState({
                  text: e.target.value,
                });
              }
            }} // handle innerHTML change
            tagName="article" // Use a custom HTML tag (uses a div by default)
          />
        </div>
      </div>
    );
  }
}

Text.defaultProps = {
  className: '',
};

Text.propTypes = {
  className: PropTypes.string,
  item: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  values: PropTypes.objectOf(PropTypes.any),
  editable: PropTypes.bool,
  onChangeValue: PropTypes.func,
  setEditing: PropTypes.func,
};

// 편집 가능한 옵션과 그 옵션들의 기본값 세팅
const pageItemProps = {};
pageItemProps[withPageItem.options.textAlign] = 'left';
pageItemProps[withPageItem.options.fontFamily] = 'inherit'; // 'LGSmHaL';
pageItemProps[withPageItem.options.fontSize] = 'inherit'; // '16px';
pageItemProps[withPageItem.options.color] = 'inherit'; // '#000000';
pageItemProps[withPageItem.options.backgroundColor] = 'transparent';
pageItemProps[withPageItem.options.alignSelf] = 'center';
pageItemProps[withPageItem.options.padding] = '1rem 1rem 1rem 1rem';
pageItemProps[withPageItem.options.border] = 'none';

pageItemProps[withPageItem.options.wrapperWidth] = 'auto';
pageItemProps[withPageItem.options.wrapperWidthUnit] = '%';
pageItemProps[withPageItem.options.wrapperHeight] = 'auto';
pageItemProps[withPageItem.options.wrapperHeightUnit] = 'px';

// 이 컴포넌트에서 사용하는 컨텐츠 관련 속성
const pageItemValues = {};
pageItemValues.text = '텍스트를 입력해주세요.';

Text.setting = {
  pageItemProps,
  pageItemValues,
};

export default withPageItem()(Text);
