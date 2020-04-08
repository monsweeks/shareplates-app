import React from 'react';
import { MaterialPicker, SwatchesPicker } from 'react-color';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import SelectControl from '@/components/PageController/SelectControl/SelectControl';
import { BORDER_WIDTHS } from '@/components/PageController/data';
import { Button, PageControlTab } from '@/components';
import './BorderControl.scss';

const tabs = [
  {
    value: 'list',
    name: '리스트',
  },
  {
    value: 'custom',
    name: '입력',
  },
];

class BorderControl extends React.Component {
  control = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      borderWidth: '0px',
      borderStyle: 'none',
      borderColor: 'transparent',
      tab: 'list',
    };
  }

  componentDidMount() {
    const { value } = this.props;
    this.setBorderValue(value);
  }

  setBorderValue = (value) => {
    if (!value || value === 'none') {
      this.setState({
        borderWidth: '0px',
        borderStyle: 'none',
        borderColor: 'transparent',
      });
    } else {
      const items = value.split(' ');
      this.setState({
        borderWidth: items[0],
        borderStyle: items[1],
        borderColor: items[2],
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { active, value } = this.props;
    const { open } = this.state;
    if (prevProps.active && !active && open) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        open: false,
        borderWidth: '0px',
        borderStyle: 'none',
        borderColor: 'transparent',
        tab: 'list',
      });
    }

    if (!prevState.open && open) {
      this.setBorderValue(value);
      document.addEventListener('mousedown', this.onOutsideClick);
    }

    if (prevState.open && !open) {
      document.removeEventListener('mousedown', this.onOutsideClick);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideClick);
  }

  onOutsideClick = (e) => {
    if (!this.control.current.contains(e.target)) {
      this.setState({
        open: false,
      });
    }
  };

  onChangeWidth = (key, width) => {
    this.setState({
      borderWidth: width,
    });
  };

  render() {
    const {
      className,
      optionKey,
      colorPickerWidth,
      colorPickerHeight,
      active,
      value,
      onSelect,
      children,
      lastValue,
      t,
    } = this.props;
    const { open, borderWidth, borderStyle, borderColor, tab } = this.state;

    return (
      <div
        ref={this.control}
        className={`border-control-wrapper ${className} ${active ? 'active' : 'in-active'} ${open ? 'open' : ''}`}
      >
        <div className="border-control-content">
          <div
            className="border-content"
            onClick={() => {
              if (active) {
                this.setState({
                  open: false,
                });
                onSelect(optionKey, lastValue);
              }
            }}
          >
            {children}
          </div>
          <div
            className="bullet"
            onClick={() => {
              if (active) {
                this.setState({
                  open: !open,
                });
              }
            }}
          >
            <span>
              <i className="far fa-angle-down" />
            </span>
          </div>
        </div>
        <div
          className={`border-picker-div ${active && open ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="sub-title">{t('선 두께')}</div>
          <div className="border-width">
            <SelectControl
              className="border-width-selector"
              height="140px"
              list={BORDER_WIDTHS}
              active
              value={borderWidth}
              onSelect={this.onChangeWidth}
            >
              <span>{borderWidth}</span>
            </SelectControl>
            <Button
              className="ml-1"
              outline
              size="xs"
              color="white"
              onClick={() => {
                this.onChangeWidth(null, '1px');
              }}
            >
              1px
            </Button>
            <Button
              className="ml-1"
              outline
              size="xs"
              color="white"
              onClick={() => {
                this.onChangeWidth(null, '2px');
              }}
            >
              2px
            </Button>
            <Button
              className="ml-1"
              outline
              size="xs"
              color="white"
              onClick={() => {
                this.onChangeWidth(null, '3px');
              }}
            >
              3px
            </Button>
            <Button
              className="ml-1"
              outline
              size="xs"
              color="white"
              onClick={() => {
                onSelect(optionKey, 'none');
                this.setState({ open: false });
              }}
            >
              {t('선 없음')}
            </Button>
          </div>
          <div className="sub-title">{t('선 타입')}</div>
          <div className="border-style">
            <Button
              className={`${borderStyle === 'solid' ? 'selected' : ''}`}
              outline
              size="xs"
              color="white"
              onClick={() => {
                this.setState({
                  borderStyle: 'solid',
                });
              }}
            >
              <div className="style-item style-solid" />
            </Button>
            <Button
              className={`ml-1 ${borderStyle === 'dashed' ? 'selected' : ''}`}
              outline
              size="xs"
              color="white"
              onClick={() => {
                this.setState({
                  borderStyle: 'dashed',
                });
              }}
            >
              <div className="style-item style-dashed" />
            </Button>
            <Button
              className={`ml-1 ${borderStyle === 'dotted' ? 'selected' : ''}`}
              outline
              size="xs"
              color="white"
              onClick={() => {
                this.setState({
                  borderStyle: 'dotted',
                });
              }}
            >
              <div className="style-item style-dotted" />
            </Button>
            <Button
              className={`ml-1 ${borderStyle === 'double' ? 'selected' : ''}`}
              outline
              size="xs"
              color="white"
              onClick={() => {
                this.setState({
                  borderStyle: 'double',
                });
              }}
            >
              <div className="style-item style-double" />
            </Button>
          </div>
          <PageControlTab
            tabTitle={t('색상')}
            tabs={tabs}
            tab={tab}
            onChange={(v) => {
              this.setState({
                tab: v,
              });
            }}
          />
          <div className="color-picker-content">
            {tab === 'list' && (
              <SwatchesPicker
                className="swatches-border-picker"
                color={borderColor}
                width={colorPickerWidth}
                height={colorPickerHeight}
                onChangeComplete={(c) => {
                  this.setState({ borderColor: c.hex });
                }}
              />
            )}
            {tab === 'custom' && (
              <>
                <MaterialPicker
                  className="material-border-picker mb-3"
                  color={borderColor}
                  onChange={(c) => {
                    this.setState({ borderColor: c.hex });
                  }}
                />
              </>
            )}
          </div>
          <div className="text-right p-2">
            <Button
              className="mr-2"
              size="sm"
              color="secondary"
              onClick={() => {
                onSelect(optionKey, value);
                this.setState({ open: false });
              }}
            >
              {t('취소')}
            </Button>
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                onSelect(optionKey, `${borderWidth} ${borderStyle} ${borderColor}`);
                this.setState({ open: false });
              }}
            >
              {t('선택')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

BorderControl.defaultProps = {
  className: '',
};

BorderControl.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  children: PropTypes.node,
  optionKey: PropTypes.string,
  colorPickerWidth: PropTypes.string,
  colorPickerHeight: PropTypes.string,
  lastValue: PropTypes.string,
  t: PropTypes.func,
};

export default withTranslation()(BorderControl);
