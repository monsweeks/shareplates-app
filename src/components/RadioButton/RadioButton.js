import React from 'react';
import PropTypes from 'prop-types';
import './RadioButton.scss';

class RadioButton extends React.PureComponent {
  render() {
    const { onClick, className, items, value } = this.props;
    return (
      <div className={`${className} g-radio-button language-button`}>
        {items.map((item) => {
          return (
            <button
              key={item.key}
              type="button"
              className={`${value === item.key ? 'selected' : ''}`}
              onClick={() => {
                onClick(item.key);
              }}
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
};

RadioButton.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  onClick: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.string,
};
