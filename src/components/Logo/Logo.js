import React from 'react';
import PropTypes from 'prop-types';
import './Logo.scss';

class Logo extends React.PureComponent {
  render() {
    const { size, className, overlapText, hideText, text, rotate } = this.props;
    return (
      <div
        className={`logo-wrapper ${size} ${className} ${overlapText ? 'overlap-text' : ''} ${
          hideText ? 'hide-text' : ''
        } ${rotate ? 'rotate' : ''}`}
      >
        <div className="logo-img">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="-3.925 -3.479 100 100"
            enableBackground="new -3.925 -3.479 100 100"
            xmlSpace="preserve"
          >
            <defs />
            <path
              className="logo-hair"
              fill="#9F6C24"
              stroke="#2A2B2B"
              strokeWidth="3"
              d="M64.971,2.2c-5.447,2.814-11.625,4.414-18.178,4.414
	c-6.592,0-12.801-1.617-18.271-4.462c-1.861,5.837-5.098,11.331-9.729,15.962c-4.803,4.803-10.531,8.113-16.611,9.938
	c2.939,5.539,4.611,11.854,4.611,18.561c0,6.63-1.637,12.876-4.512,18.369c5.918,1.852,11.488,5.109,16.178,9.799
	c4.67,4.67,7.922,10.217,9.775,16.109c5.539-2.938,11.852-4.609,18.559-4.609c6.668,0,12.947,1.654,18.465,4.561
	c1.838-5.998,5.123-11.648,9.867-16.395c4.574-4.574,9.99-7.785,15.746-9.658c-2.814-5.447-4.412-11.623-4.412-18.175
	c0-6.63,1.635-12.875,4.51-18.367c-5.918-1.851-11.49-5.11-16.178-9.799C70.084,13.74,66.816,8.144,64.971,2.2z"
            />
            <circle fill="#CB9236" stroke="#2A2B2B" strokeWidth="3" cx="46.574" cy="46.52" r="31.299" />
            <circle fill="#2A2B2B" cx="31.575" cy="36.521" r="4.333" />
            <path
              fill="#CF131C"
              stroke="#2A2B2B"
              strokeWidth="3"
              d="M50.951,63.135c0,2.485-2.015,4.5-4.5,4.5l0,0
	c-2.485,0-4.5-2.015-4.5-4.5v-7.5c0-2.485,2.015-4.5,4.5-4.5l0,0c2.485,0,4.5,2.015,4.5,4.5V63.135z"
            />
            <path
              fill="#E0E0E0"
              d="M59.075,47.574c0,5.557-5.596,10.062-12.5,10.062s-12.5-4.505-12.5-10.062S59.075,42.017,59.075,47.574z"
            />
            <circle fill="#2A2B2B" cx="46.575" cy="46.521" r="4.333" />
            <circle fill="#2A2B2B" cx="61.575" cy="36.521" r="4.333" />
            <path
              fill="#2A2B2B"
              d="M44.575,16.854c0,0,4.75,1.667,4.75,6s4.75-3.5,1.25-7S44.575,16.854,44.575,16.854z"
            />
          </svg>
        </div>
        <div className="logo-text">{text}</div>
      </div>
    );
  }
}

export default Logo;

Logo.defaultProps = {
  size: 'md',
  className: '',
  overlapText: false,
  text: <span>SHAREPLATES</span>,
  rotate: false,
};

Logo.propTypes = {
  size: PropTypes.string,
  className: PropTypes.string,
  overlapText: PropTypes.bool,
  hideText: PropTypes.bool,
  text: PropTypes.objectOf(PropTypes.any),
  rotate: PropTypes.bool,
};
