import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components';
import './PaddingControl.scss';

class PaddingControl extends React.Component {
  control = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      paddingAll: '0',
    };
  }

  componentDidMount() {
    const { value } = this.props;
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      open: false,
      paddingAll: this.getPaddingAll(value),
    });
  }

  getPaddingAll = (value) => {
    if (!value) {
      return '';
    }

    const padding = value.split(' ');

    if (
      padding &&
      padding.length === 4 &&
      padding[0] === padding[1] &&
      padding[1] === padding[2] &&
      padding[2] === padding[3]
    ) {
      return padding[0];
    }

    return '';
  };

  componentDidUpdate(prevProps, prevState) {
    const { active, value } = this.props;
    const { open } = this.state;
    if (prevProps.active && !active && open) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        open: false,
      });
    }

    if (prevProps.value !== value && !open) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        paddingAll: this.getPaddingAll(value),
      });
    }

    if (!prevProps.active && active) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        open: false,
        paddingAll: this.getPaddingAll(value),
      });
    }

    if (!prevState.open && open) {
      const padding = value.split(' ');
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        paddingTop: padding[0],
        paddingRight: padding[1],
        paddingBottom: padding[2],
        paddingLeft: padding[3],
        paddingAll: this.getPaddingAll(value),
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

  onChange = (field, value) => {
    const obj = {};
    obj[field] = value;
    this.setState({ ...obj });
  };

  getValue = (value, concat) => {
    const m = value.match(/\d+/g);
    let ns = [];
    if (m) {
      ns = m.map(Number);
    }

    const [n] = ns;
    const unit = value.substring(value.indexOf(String(n)) + String(n).length, value.length);

    if (concat) {
      if (unit) {
        return String(n) + unit;
      }

      return `${String(n)}px`;
    }

    return {
      value: Number(n),
      unit: unit || 'px',
    };
  };

  onBlur = (field, value, apply) => {
    if (!value) {
      return;
    }

    const v = this.getValue(value, true);
    if (apply && field === 'paddingAll') {
      this.onApply(v, v, v, v);
      return;
    }

    if (field === 'paddingAll') {
      this.setState({
        paddingTop: v,
        paddingRight: v,
        paddingBottom: v,
        paddingLeft: v,
        paddingAll: v,
      });
    } else {
      const obj = {};
      obj[field] = v;
      this.setState({ ...obj }, () => {
        const { paddingTop, paddingRight, paddingBottom, paddingLeft } = this.state;
        if (paddingTop === paddingRight && paddingRight === paddingBottom && paddingBottom === paddingLeft) {
          this.setState({
            paddingAll: paddingTop,
          });
        } else {
          this.setState({
            paddingAll: '',
          });
        }
      });
    }
  };

  onApply = (paddingTop, paddingRight, paddingBottom, paddingLeft) => {
    const { optionKey, onApply } = this.props;
    onApply(optionKey, `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`);
    this.setState({
      open: false,
    });
  };

  stepValue = (field, plus) => {
    const state = { ...this.state };
    const result = this.getValue(state[field]);
    const obj = {};
    result.value += plus ? 1 : -1;
    if (result.value < 0) {
      result.value = 0;
    }
    if (Number.isNaN(result.value)) {
      result.value = 0;
    }
    obj[field] = result.value + result.unit;

    if (field === 'paddingAll') {
      this.setState({
        paddingTop: obj[field],
        paddingRight: obj[field],
        paddingBottom: obj[field],
        paddingLeft: obj[field],
        paddingAll: obj[field],
      });
    } else {
      this.setState({
        ...obj,
      });
    }
  };

  render() {
    const { className, active } = this.props;
    const { open, paddingTop, paddingRight, paddingBottom, paddingLeft, paddingAll } = this.state;

    return (
      <div
        ref={this.control}
        className={`padding-control-wrapper ${className} ${active ? 'active' : 'in-active'} ${open ? 'open' : ''}`}
      >
        <div className="padding-control-content">
          <div className="padding-content">
            <input
              className="direct-input"
              spellCheck={false}
              disabled={!active}
              value={active ? paddingAll : ''}
              type="text"
              placeholder=''
              onChange={(e) => {
                this.onChange('paddingAll', e.target.value);
              }}
              onBlur={(e) => {
                this.onBlur('paddingAll', e.target.value, true);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  this.onBlur('paddingAll', paddingAll, true);
                }
              }}
            />
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
          className={`padding-picker-div ${active && open ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="top">
            <span
              className="minus-btn"
              onClick={() => {
                this.stepValue('paddingTop', false);
              }}
            >
              <i className="fal fa-minus" />
            </span>
            <input
              spellCheck={false}
              value={paddingTop}
              type="text"
              onChange={(e) => {
                this.onChange('paddingTop', e.target.value);
              }}
              onBlur={(e) => {
                this.onBlur('paddingTop', e.target.value);
              }}
            />
            <span
              className="plus-btn"
              onClick={() => {
                this.stepValue('paddingTop', true);
              }}
            >
              <i className="fal fa-plus" />
            </span>
          </div>
          <div className="center">
            <div className="left">
              <span
                className="minus-btn"
                onClick={() => {
                  this.stepValue('paddingLeft', false);
                }}
              >
                <i className="fal fa-minus" />
              </span>
              <input
                spellCheck={false}
                value={paddingLeft}
                type="text"
                onChange={(e) => {
                  this.onChange('paddingLeft', e.target.value);
                }}
                onBlur={(e) => {
                  this.onBlur('paddingLeft', e.target.value);
                }}
              />
              <span
                className="plus-btn"
                onClick={() => {
                  this.stepValue('paddingLeft', true);
                }}
              >
                <i className="fal fa-plus" />
              </span>
            </div>
            <div className="box">
              <div className="all">
                <span
                  className="minus-btn"
                  onClick={() => {
                    this.stepValue('paddingAll', false);
                  }}
                >
                  <i className="fal fa-minus" />
                </span>
                <input
                  spellCheck={false}
                  value={paddingAll}
                  type="text"
                  onChange={(e) => {
                    this.onChange('paddingAll', e.target.value);
                  }}
                  onBlur={(e) => {
                    this.onBlur('paddingAll', e.target.value);
                  }}
                />
                <span
                  className="plus-btn"
                  onClick={() => {
                    this.stepValue('paddingAll', true);
                  }}
                >
                  <i className="fal fa-plus" />
                </span>
              </div>
            </div>
            <div className="right">
              <span
                className="minus-btn"
                onClick={() => {
                  this.stepValue('paddingRight', false);
                }}
              >
                <i className="fal fa-minus" />
              </span>
              <input
                spellCheck={false}
                value={paddingRight}
                type="text"
                onChange={(e) => {
                  this.onChange('paddingRight', e.target.value);
                }}
                onBlur={(e) => {
                  this.onBlur('paddingRight', e.target.value);
                }}
              />
              <span
                className="plus-btn"
                onClick={() => {
                  this.stepValue('paddingRight', true);
                }}
              >
                <i className="fal fa-plus" />
              </span>
            </div>
          </div>
          <div className="bottom">
            <span
              className="minus-btn"
              onClick={() => {
                this.stepValue('paddingBottom', false);
              }}
            >
              <i className="fal fa-minus" />
            </span>
            <input
              spellCheck={false}
              value={paddingBottom}
              type="text"
              onChange={(e) => {
                this.onChange('paddingBottom', e.target.value);
              }}
              onBlur={(e) => {
                this.onBlur('paddingBottom', e.target.value);
              }}
            />
            <span
              className="plus-btn"
              onClick={() => {
                this.stepValue('paddingBottom', true);
              }}
            >
              <i className="fal fa-plus" />
            </span>
          </div>
          <div className="pt-3 px-2">
            <Button
              className="mr-2"
              color="secondary"
              size="sm"
              onClick={() => {
                const { value } = this.props;
                this.setState({
                  paddingAll: this.getPaddingAll(value),
                  open: false,
                });
              }}
            >
              취소
            </Button>
            <Button
              color="primary"
              size="sm"
              onClick={() => {
                this.onApply(paddingTop, paddingRight, paddingBottom, paddingLeft);
              }}
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

PaddingControl.defaultProps = {
  className: '',
};

PaddingControl.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  value: PropTypes.string,
  onApply: PropTypes.func,
  optionKey: PropTypes.string,
};

export default PaddingControl;
