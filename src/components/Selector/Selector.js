import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './Selector.scss';

class Selector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  render() {
    const { open } = this.state;
    const { className, onChange, items, value } = this.props;
    const selcetedItem = items.find((item) => item.key === value);

    return (
      <div className={`selector-wrapper ${className}`}>
        <div
          className={`${open ? 'open' : ''} selector-current`}
          onClick={() => {
            this.setState({
              open: !open,
            });
          }}
        >
          <span className="text">{selcetedItem ? selcetedItem.value : ''}</span>
          <span className="liner">
            <span />
          </span>
          <span className="icon">
            <i className={`fal fa-chevron-${open ? 'up' : 'down'}`} />
          </span>
        </div>
        <div className={`${open ? 'd-block' : 'd-none'} selector-list scrollbar-sm`}>
          <ul>
            {items.map((item) => {
              return (
                <li
                  key={item.key}
                  className={value === item.key ? 'selected' : ''}
                  onClick={() => {
                    onChange(item.key);
                    this.setState({
                      open: false,
                    });
                  }}
                >
                  <span className='select-arrow' />
                  {item.value}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Selector);

Selector.defaultProps = {
  className: '',
};

Selector.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
