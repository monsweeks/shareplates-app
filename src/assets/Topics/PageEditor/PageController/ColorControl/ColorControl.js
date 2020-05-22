import React from 'react';
import PropTypes from 'prop-types';
import { MaterialPicker, SwatchesPicker } from 'react-color';
import { Button } from '@/components';
import './ColorControl.scss';

class ColorControl extends React.Component {
  control = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      color: '#FFF',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { active, value } = this.props;
    const { open } = this.state;
    if (prevProps.active && !active && open) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        open: false,
      });
    }

    if (!prevState.open && open) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        color: value,
      });
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
    if (this.control.current && !this.control.current.contains(e.target)) {
      this.setState({
        open: false,
      });
    }
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
      lastColor,
      dataTip,
      clearColor,
      disableChildrenClickEvent,
    } = this.props;
    const { open, color } = this.state;

    return (
      <div
        ref={this.control}
        className={`color-control-wrapper ${className} ${active ? 'active' : 'in-active'} ${open ? 'open' : ''}`}
        data-tip={dataTip}
      >
        <div className="color-control-content">
          <div
            className={`color-content ${disableChildrenClickEvent ? 'disable-hover' : 'enable-hover'}`}
            onClick={() => {
              if (!disableChildrenClickEvent && active) {
                this.setState({
                  open: false,
                });
                onSelect(optionKey, lastColor);
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
              <i className="fal fa-angle-down" />
            </span>
          </div>
        </div>
        <div
          className={`color-picker-div ${active && open ? 'open' : ''}`}
          style={{
            left: `-${Number.parseInt(colorPickerWidth, 10) / 2 - 20}px`,
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="material-color-picker-div">
            <MaterialPicker
              className="material-color-picker"
              color={color}
              onChange={(c) => {
                this.setState({ color: c.hex });
              }}
            />
            <SwatchesPicker
              className="swatches-color-picker"
              color={color}
              width={colorPickerWidth}
              height={colorPickerHeight}
              onChangeComplete={(c) => {
                onSelect(optionKey, c.hex);
                this.setState({ color: c.hex, open: false });
              }}
            />
          </div>
          <div className="text-right p-2">
            <Button
              className="mr-2 float-left"
              size="sm"
              color="white"
              onClick={() => {
                onSelect(optionKey, clearColor || 'transparent');
                this.setState({ open: false });
              }}
            >
              색상 제거
            </Button>
            <Button
              className="mr-2"
              size="sm"
              color="secondary"
              onClick={() => {
                onSelect(optionKey, value);
                this.setState({ open: false });
              }}
            >
              취소
            </Button>
            <Button
              size="sm"
              color="primary"
              onClick={() => {
                onSelect(optionKey, color);
                this.setState({ open: false });
              }}
            >
              선택
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

ColorControl.defaultProps = {
  className: '',
  disableChildrenClickEvent : false,
};

ColorControl.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  children: PropTypes.node,
  optionKey: PropTypes.string,
  colorPickerWidth: PropTypes.string,
  colorPickerHeight: PropTypes.string,
  lastColor: PropTypes.string,
  dataTip: PropTypes.string,
  clearColor: PropTypes.string,
  disableChildrenClickEvent : PropTypes.bool,
};

export default ColorControl;
