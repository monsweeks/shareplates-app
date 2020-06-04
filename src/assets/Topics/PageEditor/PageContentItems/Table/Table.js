import React from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import withPageItem from '@/assets/Topics/PageEditor/PageContentItems/withPageItem';
import './Table.scss';

class Table extends React.PureComponent {
  control = React.createRef();

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

  render() {
    const {
      className,
      item,
      style,
      editable,
      setEditing,
      childSelectedList,
      setChildSelectedInfo,
      selected,
    } = this.props;
    const { rows, edit } = this.state;
    const { alignSelf, ...last } = style;

    return (
      <div
        ref={this.control}
        className={`table-wrapper ${className} ${editable ? 'editable' : ''}`}
        {...item}
        style={last}
        onClick={() => {
          if (editable && edit) {
            this.setState({
              edit: false,
            });
            setEditing(false);
            setChildSelectedInfo(null);
          }
        }}
      >
        <div
          style={{
            alignSelf,
          }}
        >
          <table>
            <tbody>
              {rows &&
                rows.map((row, inx) => {
                  return (
                    <tr key={inx}>
                      {row.cols.map((col, jnx) => {
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
                            }`}
                            key={jnx}
                            style={col.options}
                            html={col.text} // innerHTML of the editable div
                            disabled={!edit} // use true to disable editing
                            onClick={(e) => {
                              if (editable && !edit) {
                                this.setState({
                                  edit: true,
                                });
                                setEditing(true);
                              } else {
                                e.stopPropagation();
                              }

                              if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
                                setChildSelectedInfo([inx, jnx], 'click');
                              } else if (e.ctrlKey) {
                                setChildSelectedInfo([inx, jnx], 'ctrl');
                              } else if (e.altKey) {
                                setChildSelectedInfo([inx, jnx], 'alt');
                              } else if (e.shiftKey) {
                                if (childSelectedList && childSelectedList.length > 0) {
                                  const selectedList = [];
                                  for (let i = childSelectedList[0][0]; i <= inx; i += 1) {
                                    for (let j = childSelectedList[0][1]; j <= jnx; j += 1) {
                                      selectedList.push([i, j]);
                                    }
                                  }
                                  setChildSelectedInfo(selectedList, 'shift');
                                } else {
                                  setChildSelectedInfo([inx, jnx], 'click');
                                }
                              }
                            }}
                            onChange={(e) => {
                              this.onCellTextChange(inx, jnx, e.target.value);
                            }} // handle innerHTML change
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
  setChildSelectedInfo: PropTypes.func,
  selected: PropTypes.bool,
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
pageItemValues.rows = [];
pageItemValues.rows.push({
  cols: [
    {
      text: '셀',
      options: {
        backgroundColor: '#EEE',
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
    {
      text: '셀',
      options: {
        backgroundColor: '#EEE',
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
    {
      text: '셀',
      options: {
        backgroundColor: '#EEE',
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
  ],
});
pageItemValues.rows.push({
  cols: [
    {
      text: '셀',
      options: {
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
    {
      text: '셀',
      options: {
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
    {
      text: '셀',
      options: {
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
  ],
});
pageItemValues.rows.push({
  cols: [
    {
      text: '셀',
      options: {
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
    {
      text: '셀',
      options: {
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
    {
      text: '셀',
      options: {
        padding: '0.5rem 0.5rem 0.5rem 0.5rem ',
        border: '1px solid #333',
      },
    },
  ],
});

Table.setting = {
  pageItemProps,
  pageItemValues,
};

export default withPageItem()(Table);
