import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import './RadioButton.scss';

class RadioButton extends React.PureComponent {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { onClick, className, items, value, circle, size, outline } = this.props;
    return (
      <div className={`radio-button-wrapper ${className} ${size} ${outline ? 'outline' : ''}`}>
        {items.map((item) => {
          return (
            <button
              key={item.key}
              type="button"
              className={`${value === item.key ? 'selected' : ''} ${circle ? 'circle' : ''}`}
              onClick={() => {
                onClick(item.key);
              }}
              data-tip={item.tooltip}
            >
              {item.value}
            </button>
          );
        })}
      </div>
    );
  }
}

export default RadioButton;

RadioButton.defaultProps = {
  className: '',
  items: [],
  circle: false,
  size: 'md',
  outline: false,
};

RadioButton.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      tooltip: PropTypes.string,
    }),
  ),
  onClick: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  circle: PropTypes.bool,
  size: PropTypes.string,
  outline: PropTypes.bool,
};
