import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import './RadioButton.scss';

class RadioButton extends React.PureComponent {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { onClick, className, items, value, circle, size } = this.props;
    return (
      <div className={`radio-button-wrapper ${className} ${size}`}>
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
  size : 'md'
};

RadioButton.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      tooltip: PropTypes.string,
    }),
  ),
  onClick: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.string,
  circle: PropTypes.bool,
  size : PropTypes.string,
};
