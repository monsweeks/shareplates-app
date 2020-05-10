import React from 'react';
import Color from 'color';
import PropTypes from 'prop-types';
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
} from '../AvatarBuilder/avatar.js';
import './Avatar.scss';

class Avatar extends React.Component {
  id = new Date().getTime();

  getHair = (shape, color) => {
    return (
      <>
        {this.getBackHair(shape, color)}
        {this.getFrontHair(shape, color)}
      </>
    );
  };

  getBackHair = (shape, color) => {
    if (!shape) {
      return null;
    }

    return (
      <g className="back-hair" /* 얼굴 뒤 머리 */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.backTag(color)}
      </g>
    );
  };

  getFrontHair = (shape, color) => {
    if (!shape) {
      return null;
    }

    return (
      <g className="front-hair" /* 얼굴 앞 머리 */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.foreTag(color)}
      </g>
    );
  };

  getFace = (shape) => {
    if (!shape) {
      return null;
    }

    return (
      <g className="face" /* 얼굴  */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.tag}
      </g>
    );
  };

  getAccessory = (shape, color) => {
    if (!shape) {
      return null;
    }

    return (
      <g className="accessory" /* 액세서리  */ transform={`translate(-${shape.cx}, -${shape.cy})`}>
        {shape.tag(color)}
      </g>
    );
  };

  getForm = (shape, color, clothColor, key) => {
    if (!shape) {
      return null;
    }

    const { id } = this;

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

  render() {
    const { data, className } = this.props;
    return (
      <article className={`avatar-wrapper g-no-select ${className}`}>
        {data && (
          <div className="image-box">
            <svg viewBox="0 0 100 100">
              <g /* 배경 원 */>
                <ellipse
                  cx="50"
                  cy="50"
                  rx="50"
                  ry="50"
                  style={{
                    fill: bgColors[data.bgStyleNumber],
                  }}
                />
              </g>
              {this.getBackHair(hairs[data.hairNumber], hairColors[data.hairColorNumber])}
              {this.getForm(
                forms[data.formNumber],
                faceColors[data.faceColorNumber],
                clothColors[data.clothColorNumber],
                'preview',
              )}
              {this.getFace(faces[data.faceNumber])}
              {this.getAccessory(accessories[data.accessoryNumber], allColors[data.accessoryColorNumber])}
              {this.getFrontHair(hairs[data.hairNumber], hairColors[data.hairColorNumber])}
            </svg>
          </div>
        )}
      </article>
    );
  }
}
export default Avatar;

Avatar.defaultProps = {
  data: {},
  className: '',
};

Avatar.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};
