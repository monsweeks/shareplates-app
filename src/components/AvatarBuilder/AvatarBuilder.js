import React from 'react';
import './AvatarBuilder.scss';
import Color from 'color';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader, CircleIcon, Nav, NavItem } from '@/components';
import {
  accessories,
  allColors,
  bgColors,
  clothColors,
  faceColors,
  faces,
  forms,
  hairColors,
  hairs,
} from './avatar.js';

const tabs = [
  {
    key: 'BG',
    name: '배경',
  },
  {
    key: 'FORM',
    name: '외형',
  },
  {
    key: 'FACE',
    name: '얼굴',
  },
  {
    key: 'HAIR',
    name: '헤어스타일',
  },
  {
    key: 'ACCESSORY',
    name: '액서사리',
  },
];

class AvatarBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      style: this.getDefaultStyle(),
      tab: 'BG',
      id: new Date().getTime(),
    };
  }

  onChange = (field, val) => {
    const { onChange } = this.props;
    const data = { ...this.state };
    data.style[field] = val;
    this.setState(data);
    if (onChange) onChange(JSON.stringify(data.style));
  };

  static getDerivedStateFromProps(props) {
    if (props.data) {
      try {
        const data = JSON.parse(props.data);
        return {
          style: data,
        };
      } catch {
        return null;
      }
    }

    return null;
  }

  getRandomIndex = (list) => {
    return Math.floor(Math.random() * list.length);
  };

  getDefaultStyle = () => {
    return {
      bgStyleNumber: 0,
      formNumber: 3,
      hairNumber: 1,
      faceNumber: 1,
      accessoryNumber: 0,
      faceColorNumber: 3,
      hairColorNumber: 0,
      accessoryColorNumber: 0,
      clothColorNumber: 1,
    };
  };

  getRandomStyle = () => {
    return {
      bgStyleNumber: this.getRandomIndex(bgColors),
      formNumber: this.getRandomIndex(forms),
      hairNumber: this.getRandomIndex(hairs),
      faceNumber: this.getRandomIndex(faces),
      accessoryNumber: this.getRandomIndex(accessories),
      faceColorNumber: this.getRandomIndex(faceColors),
      hairColorNumber: this.getRandomIndex(hairColors),
      accessoryColorNumber: this.getRandomIndex(allColors),
      clothColorNumber: this.getRandomIndex(clothColors),
    };
  };

  getColorControl = (label, list, selectedIndex, fieldName) => {
    return (
      <div>
        <div className="arrow-btn">
          <span
            onClick={() => {
              let nextNumber = selectedIndex - 1;
              if (nextNumber < 0) {
                nextNumber = list.length - 1;
              }

              this.onChange(fieldName, nextNumber);
            }}
          >
            <i className="fal fa-chevron-left" />
          </span>
        </div>
        <div className="picker-content color-picker scrollbar">
          {list.map((color, i) => {
            return (
              <span
                key={i}
                className={`picker-item ${selectedIndex === i ? 'selected' : ''}`}
                onClick={() => {
                  this.onChange(fieldName, i);
                }}
                style={{
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
        <div className="arrow-btn">
          <span
            onClick={() => {
              let nextNumber = selectedIndex + 1;
              if (nextNumber > list.length - 1) {
                nextNumber = 0;
              }

              this.onChange(fieldName, nextNumber);
            }}
          >
            <i className="fal fa-chevron-right" />
          </span>
        </div>
      </div>
    );
  };

  getHair = (shape, color) => {
    return (
      <>
        {this.getBackHair(shape, color)}
        {this.getFrontHair(shape, color)}
      </>
    );
  };

  getBackHair = (shape, color) => {
    return (
      <g className="back-hair" /* 얼굴 뒤 머리 */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.backTag(color)}
      </g>
    );
  };

  getFrontHair = (shape, color) => {
    return (
      <g className="front-hair" /* 얼굴 앞 머리 */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.foreTag(color)}
      </g>
    );
  };

  getFace = (shape) => {
    return (
      <g className="face" /* 얼굴  */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.tag}
      </g>
    );
  };

  getAccessory = (shape, color) => {
    return (
      <g className="accessory" /* 액세서리  */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.tag(color)}
      </g>
    );
  };

  getForm = (shape, color, clothColor, key) => {
    const { id } = this.state;

    const darkenColor = Color(color)
      .darken(0.07)
      .hex();

    return (
      <g /* 형태 */ className="face-form" transform={`translate(-${shape.cx - 50}, -${shape.cy - 50})`}>
        <defs>
          <ellipse id={`CLIP_DEF_ID_${id}_${key}`} cx={shape.cx} cy={shape.cy} rx="50" ry="50" />
        </defs>
        <clipPath id={`CLIP_PATH_ID_${id}_${key}`}>
          <use xlinkHref={`#CLIP_DEF_ID_${id}_${key}`} style={{ overflow: 'visible' }} />
        </clipPath>

        <g
          style={{
            clipPath: `url(#CLIP_PATH_ID_${id}_${key})`,
          }}
        >
          {shape.tag(color, darkenColor, clothColor)}
        </g>
      </g>
    );
  };

  getShapeControl = (label, list, selectedIndex, fieldName, getShapeFunction) => {
    return (
      <div>
        <div className="arrow-btn">
          <span
            onClick={() => {
              let nextNumber = selectedIndex - 1;
              if (nextNumber < 0) {
                nextNumber = list.length - 1;
              }

              this.onChange(fieldName, nextNumber);
            }}
          >
            <i className="fal fa-chevron-left" />
          </span>
        </div>
        <div className="picker-content shape-picker scrollbar-sm">
          {list.map((shape, i) => {
            return (
              <span
                key={i}
                className={`picker-item ${selectedIndex === i ? 'selected' : ''}`}
                onClick={() => {
                  this.onChange(fieldName, i);
                }}
              >
                <svg viewBox="0 0 100 100">{getShapeFunction(shape, '#333', '#666', i)}</svg>
              </span>
            );
          })}
        </div>
        <div className="arrow-btn">
          <span
            onClick={() => {
              let nextNumber = selectedIndex + 1;
              if (nextNumber > list.length - 1) {
                nextNumber = 0;
              }
              this.onChange(fieldName, nextNumber);
            }}
          >
            <i className="fal fa-chevron-right" />
          </span>
        </div>
      </div>
    );
  };

  changeTab = (tab) => {
    this.setState({
      tab,
    });
  };

  render() {
    const { style, tab } = this.state;
    const {
      bgStyleNumber,
      formNumber,
      hairNumber,
      faceNumber,
      accessoryNumber,
      faceColorNumber,
      hairColorNumber,
      accessoryColorNumber,
      clothColorNumber,
    } = style;

    const { onChange, className } = this.props;

    return (
      <article className={`avatar-builder g-no-select ${className}`}>
        <div className="preview-box">
          <div className="preview-image">
            <svg viewBox="0 0 100 100">
              <g /* 배경 원 */>
                <ellipse
                  cx="50"
                  cy="50"
                  rx="50"
                  ry="50"
                  style={{
                    fill: bgColors[bgStyleNumber],
                  }}
                />
              </g>
              {this.getBackHair(hairs[hairNumber], hairColors[hairColorNumber])}
              {this.getForm(forms[formNumber], faceColors[faceColorNumber], clothColors[clothColorNumber], 'preview')}
              {this.getFace(faces[faceNumber])}
              {this.getAccessory(accessories[accessoryNumber], allColors[accessoryColorNumber])}
              {this.getFrontHair(hairs[hairNumber], hairColors[hairColorNumber])}
            </svg>
          </div>
          <div className="random-button d-none">
            <CircleIcon
              className=""
              icon={<i className="fal fa-transporter" />}
              onClick={() => {
                if (onChange) onChange(JSON.stringify(this.getRandomStyle()));
              }}
            />
          </div>
        </div>
        <div className="controller">
          <Card className="g-border-normal border-0">
            <CardHeader className="g-border-normal p-0 border-0 bg-white">
              <Nav className="tabs px-0 text-center text-sm-left d-block d-sm-flex" tabs>
                {tabs.map((t) => {
                  return (
                    <NavItem
                      key={t.key}
                      className={tab === t.key ? 'focus' : ''}
                      onClick={() => {
                        this.changeTab(t.key);
                      }}
                    >
                      {t.name}
                    </NavItem>
                  );
                })}
              </Nav>
            </CardHeader>
            <CardBody className="p-0">
              {tab === 'BG' && (
                <div className="control-box">
                  {this.getColorControl('배경 색상', bgColors, bgStyleNumber, 'bgStyleNumber')}
                </div>
              )}
              {tab === 'FORM' && (
                <div className="control-box">
                  {this.getShapeControl('얼굴 형태', forms, formNumber, 'formNumber', this.getForm)}
                  {this.getColorControl('피부', faceColors, faceColorNumber, 'faceColorNumber')}
                </div>
              )}
              {tab === 'FACE' && (
                <div className="control-box">
                  {this.getShapeControl('눈코입', faces, faceNumber, 'faceNumber', this.getFace)}
                  {this.getColorControl('의상', clothColors, clothColorNumber, 'clothColorNumber')}
                </div>
              )}

              {tab === 'HAIR' && (
                <div className="control-box">
                  {this.getShapeControl('헤어스타일', hairs, hairNumber, 'hairNumber', this.getHair)}
                  {this.getColorControl('머리 색상', hairColors, hairColorNumber, 'hairColorNumber')}
                </div>
              )}
              {tab === 'ACCESSORY' && (
                <div className="control-box">
                  {this.getShapeControl('액서사리', accessories, accessoryNumber, 'accessoryNumber', this.getAccessory)}
                  {this.getColorControl('액서사리 색상', allColors, accessoryColorNumber, 'accessoryColorNumber')}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </article>
    );
  }
}
export default AvatarBuilder;

AvatarBuilder.defaultProps = {
  className: '',
};

AvatarBuilder.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.string,
  className: PropTypes.string,
};
