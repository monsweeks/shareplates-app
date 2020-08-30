import React from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import withPageItem from '@/assets/Topics/PageEditor/PageContentItems/withPageItem';
import './Table.scss';
import { getBlockMarginByAlign, getSize } from '@/assets/Topics/PageEditor/PageContentItems/util';
import { PointerPropTypes } from '@/proptypes';

class Table extends React.PureComponent {
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

  onCellTextChange = (rowIndex, colIndex, text) => {
    const { rows } = this.state;
    const next = rows.slice(0);
    next[rowIndex].cols[colIndex].text = text;
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
      clearTextSelection,
      pointer,
      onPointer,
    } = this.props;
    const { rows, edit } = this.state;
    const { alignSelf, textAlign, width, widthUnit, ...last } = style;

    return (
      <div
        ref={this.control}
        className={`table-wrapper ${className} ${editable ? 'editable' : ''}`}
        {...item}
        style={last}
        onClick={() => {
          if (clearTextSelection) {
            clearTextSelection();
          }

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
          <table
            style={{
              width: getSize(width, widthUnit),
              margin: getBlockMarginByAlign(textAlign),
            }}
          >
            <tbody>
              {rows &&
                rows.map((row, inx) => {
                  return (
                    <tr key={inx}>
                      {row.cols.map((col, jnx) => {
                        const {
                          width: cellWidth,
                          widthUnit: cellWidthUnit,
                          wrapperHeight,
                          wrapperHeightUnit,
                          alignSelf: cellAlignSelf,
                          ...lastOption
                        } = col.options;
                        return (
                          <ContentEditable
                            className={`table-cell ${
                              selected &&
                              childSelectedList &&
                              childSelectedList.length > 0 &&
                              childSelectedList.findIndex(
                                (info) => JSON.stringify(info) === JSON.stringify([inx, jnx]),
                              ) > -1
                                ? 'selected'
                                : ''
                            }
                            
                            ${
                              pointer && String(pointer.itemId) === String(item.id) && pointer.index1 === inx && pointer.index2 === jnx
                                ? `g-pointed g-${pointer.style} g-${pointer.color}`
                                : ''
                            }
                            
                            `}
                            key={jnx}
                            style={{
                              width: getSize(cellWidth, cellWidthUnit),
                              height: getSize(wrapperHeight, wrapperHeightUnit),
                              verticalAlign: this.getTableAlignSelf(cellAlignSelf),
                              ...lastOption,
                            }}
                            html={col.text}
                            disabled={!edit}
                            onClick={(e) => {
                              e.stopPropagation();

                              if (onPointer) {
                                onPointer(item.id, inx, jnx);
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
                                  setChildSelectedInfo(item.id, [inx, jnx], 'click');
                                } else if (e.ctrlKey) {
                                  setChildSelectedInfo(item.id, [inx, jnx], 'ctrl');
                                } else if (e.altKey) {
                                  setChildSelectedInfo(item.id, [inx, jnx], 'alt');
                                } else if (e.shiftKey) {
                                  if (childSelectedList && childSelectedList.length > 0) {
                                    const selectedList = [];
                                    for (let i = childSelectedList[0][0]; i <= inx; i += 1) {
                                      for (let j = childSelectedList[0][1]; j <= jnx; j += 1) {
                                        selectedList.push([i, j]);
                                      }
                                    }
                                    setChildSelectedInfo(item.id, selectedList, 'shift');
                                  } else {
                                    setChildSelectedInfo(item.id, [inx, jnx], 'click');
                                  }
                                }
                              }
                            }}
                            onChange={(e) => {
                              this.onCellTextChange(inx, jnx, e.target.value);
                            }}
                            tagName="td"
                          />
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

Table.defaultProps = {
  className: '',
};

Table.propTypes = {
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
  clearTextSelection: PropTypes.func,
  pointer: PointerPropTypes,
  onPointer: PropTypes.func,
};

// 편집 가능한 옵션과 그 옵션들의 기본값 세팅
const pageItemProps = {};
pageItemProps[withPageItem.options.textAlign] = 'center';
pageItemProps[withPageItem.options.fontFamily] = 'inherit'; // 'LGSmHaL';
pageItemProps[withPageItem.options.fontSize] = 'inherit'; // '16px';
pageItemProps[withPageItem.options.color] = 'inherit'; // '#000000';
pageItemProps[withPageItem.options.backgroundColor] = 'transparent';
pageItemProps[withPageItem.options.alignSelf] = 'center';
pageItemProps[withPageItem.options.padding] = '1rem 1rem 1rem 1rem';
pageItemProps[withPageItem.options.border] = 'none';
pageItemProps[withPageItem.options.width] = '100';
pageItemProps[withPageItem.options.widthUnit] = '%';
pageItemProps[withPageItem.options.fontWeight] = 'inherit';
pageItemProps[withPageItem.options.textDecorationLine] = 'none';
pageItemProps[withPageItem.options.textDecorationStyle] = 'solid';
pageItemProps[withPageItem.options.textDecorationColor] = '#333333';
pageItemProps[withPageItem.options.wrapperHeight] = 'auto';
pageItemProps[withPageItem.options.wrapperHeightUnit] = 'px';

// 이 컴포넌트에서 사용하는 컨텐츠 관련 속성
const pageItemValues = {};
pageItemValues.rows = [];

const headerCell = {
  text: '셀',
  options: {
    textAlign: 'center',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    backgroundColor: '#EEE',
    alignSelf: 'center',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    border: '2px solid #666',
    width: 'auto',
    widthUnit: '%',
    wrapperHeight: 'auto',
    wrapperHeightUnit: 'px',
    fontWeight: 'inherit',
    textDecorationLine: 'none',
    textDecorationStyle: 'solid',
    textDecorationColor: '#333333',
  },
};

const contentCell = {
  text: '셀',
  options: {
    textAlign: 'center',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    color: 'inherit',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    border: '2px solid #666',
    width: 'auto',
    widthUnit: '%',
    wrapperHeight: 'auto',
    wrapperHeightUnit: 'px',
    fontWeight: 'inherit',
    textDecorationLine: 'none',
    textDecorationStyle: 'solid',
    textDecorationColor: '#333333',
  },
};

pageItemValues.rows.push({
  cols: [headerCell, headerCell, headerCell],
});
pageItemValues.rows.push({
  cols: [contentCell, contentCell, contentCell],
});
pageItemValues.rows.push({
  cols: [contentCell, contentCell, contentCell],
});

Table.setting = {
  pageItemProps,
  pageItemValues,
};

export default withPageItem()(Table);
