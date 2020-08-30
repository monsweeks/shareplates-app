import React from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import withPageItem from '@/assets/Topics/PageEditor/PageContentItems/withPageItem';
import './List.scss';
import { getSize } from '@/assets/Topics/PageEditor/PageContentItems/util';
import { PointerPropTypes } from '@/proptypes';

class List extends React.PureComponent {
  control = React.createRef();

  clickedCell = null;

  constructor(props) {
    super(props);
    this.state = {
      rows: null,
      edit: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.edit && props.values && props.values.rows) {
      return {
        rows: JSON.parse(JSON.stringify(props.values.rows)),
      };
    }

    return null;
  }

  onOutsideClick = (e) => {
    const { onChangeValue, setEditing } = this.props;
    const { rows } = this.state;

    onChangeValue({
      rows,
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

  onCellTextChange = (rowIndex, text) => {
    const { rows } = this.state;
    const next = rows.slice(0);
    next[rowIndex].text = text;
    this.setState({
      rows: next,
    });
  };

  getTableAlignSelf = (alignSelf) => {
    if (alignSelf === 'flex-end') {
      return 'bottom';
    }

    if (alignSelf === 'baseline') {
      return 'top';
    }

    if (alignSelf === 'center') {
      return 'middle';
    }

    return alignSelf;
  };

  render() {
    const {
      className,
      item,
      style,
      editable,
      setEditing,
      childSelectedList,
      setSelectedItem,
      setChildSelectedInfo,
      selected,
      pointer,
      onPointer,
    } = this.props;
    const { rows, edit } = this.state;
    const { alignSelf, textAlign, width, widthUnit, listStyle, indentLevel, ...last } = style;
    const listValues = {};
    let lastIndent = 0;

    return (
      <div
        ref={this.control}
        className={`list-wrapper ${className} ${editable ? 'editable' : ''}`}
        {...item}
        style={last}
        onClick={() => {
          if (editable && edit) {
            this.setState({
              edit: false,
            });
            setEditing(false);
            setSelectedItem(item.id, item.options);
          }
        }}
      >
        <div
          style={{
            alignSelf,
          }}
        >
          <ul
            style={{
              width: getSize(width, widthUnit),
              textAlign,
              listStyle,
              paddingLeft: `${indentLevel * 2}rem`,
            }}
            className={`${String(pointer.itemId) === String(item.id) && pointer.index1 === null? `g-pointed g-${pointer.style} g-${pointer.color}` : ''}`}
          >
            {rows &&
              rows.map((row, inx) => {
                const {
                  width: cellWidth,
                  widthUnit: cellWidthUnit,
                  wrapperHeight,
                  wrapperHeightUnit,
                  alignSelf: cellAlignSelf,
                  indentLevel: itemIndentLevel,
                  ...lastOption
                } = row.options;

                if (!listValues[itemIndentLevel]) {
                  listValues[itemIndentLevel] = 1;
                } else {
                  listValues[itemIndentLevel] += 1;
                }

                if (lastIndent < itemIndentLevel) {
                  listValues[itemIndentLevel] = 1;
                }

                lastIndent = itemIndentLevel;

                return (
                  <ContentEditable
                    key={inx}
                    className={`list-item ${
                      selected &&
                      childSelectedList &&
                      childSelectedList.length > 0 &&
                      childSelectedList.findIndex((info) => JSON.stringify(info) === JSON.stringify([inx])) > -1
                        ? 'selected'
                        : ''
                    }
                    ${
                      String(pointer.itemId) === String(item.id) && pointer.index1 === inx
                        ? `g-pointed g-${pointer.style} g-${pointer.color}`
                        : ''
                    }
                    
                    `}
                    value={listValues[itemIndentLevel]}
                    style={{
                      width: getSize(cellWidth, cellWidthUnit),
                      height: getSize(wrapperHeight, wrapperHeightUnit),
                      verticalAlign: this.getTableAlignSelf(cellAlignSelf),
                      marginLeft: `${itemIndentLevel * 2}rem`,
                      value: listValues[itemIndentLevel],
                      ...lastOption,
                    }}
                    html={row.text}
                    disabled={!edit}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (onPointer) {
                        onPointer(item.id, inx, null);
                      }

                      if (editable && !edit) {
                        this.setState({
                          edit: true,
                        });
                        setEditing(true);

                        this.clickedCell = e.target;
                        setTimeout(() => {
                          this.clickedCell.focus();
                          this.clickedCell = null;
                        }, 200);

                        if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
                          setChildSelectedInfo(item.id, [inx], 'click');
                        } else if (e.ctrlKey) {
                          setChildSelectedInfo(item.id, [inx], 'ctrl');
                        } else if (e.altKey) {
                          setChildSelectedInfo(item.id, [inx], 'alt');
                        } else if (e.shiftKey) {
                          if (childSelectedList && childSelectedList.length > 0) {
                            const selectedList = [];
                            for (let i = Number(childSelectedList[0]); i <= inx; i += 1) {
                              selectedList.push([i]);
                            }
                            setChildSelectedInfo(item.id, selectedList, 'shift');
                          } else {
                            setChildSelectedInfo(item.id, [inx], 'click');
                          }
                        }
                      }
                    }}
                    onChange={(e) => {
                      this.onCellTextChange(inx, e.target.value);
                    }}
                    tagName="li"
                  />
                );
              })}
          </ul>
        </div>
      </div>
    );
  }
}

List.defaultProps = {
  className: '',
};

List.propTypes = {
  className: PropTypes.string,
  item: PropTypes.objectOf(PropTypes.any),
  style: PropTypes.objectOf(PropTypes.any),
  values: PropTypes.objectOf(PropTypes.any),
  editable: PropTypes.bool,
  onChangeValue: PropTypes.func,
  setEditing: PropTypes.func,
  rows: PropTypes.arrayOf(PropTypes.any),
  childSelectedList: PropTypes.arrayOf(PropTypes.any),
  setSelectedItem: PropTypes.func,
  setChildSelectedInfo: PropTypes.func,
  selected: PropTypes.bool,
  pointer: PointerPropTypes,
  onPointer: PropTypes.func,
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
pageItemProps[withPageItem.options.width] = '100';
pageItemProps[withPageItem.options.widthUnit] = '%';
pageItemProps[withPageItem.options.wrapperHeight] = 'auto';
pageItemProps[withPageItem.options.wrapperHeightUnit] = 'px';
pageItemProps[withPageItem.options.listStyle] = 'circle';
pageItemProps[withPageItem.options.indentLevel] = '0';
pageItemProps[withPageItem.options.fontWeight] = 'inherit';
pageItemProps[withPageItem.options.textDecorationLine] = 'none';
pageItemProps[withPageItem.options.textDecorationStyle] = 'solid';
pageItemProps[withPageItem.options.textDecorationColor] = '#333333';

// 이 컴포넌트에서 사용하는 컨텐츠 관련 속성
const pageItemValues = {};
pageItemValues.rows = [];

const item = {
  text: '아이템',
  rows: [],
  options: {
    textAlign: 'inherit',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    border: 'none',
    width: 'auto',
    widthUnit: '%',
    wrapperHeight: 'auto',
    wrapperHeightUnit: 'px',
    listStyle: 'inherit',
    indentLevel: 0,
    fontWeight: 'inherit',
    textDecorationLine: 'none',
    textDecorationStyle: 'solid',
    textDecorationColor: '#333333',
  },
};

pageItemValues.rows.push(item);
pageItemValues.rows.push(item);
pageItemValues.rows.push(item);

List.setting = {
  pageItemProps,
  pageItemValues,
};

export default withPageItem()(List);
