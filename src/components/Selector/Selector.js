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
    const { className, onChange, items, value, addAll } = this.props;
    let selcetedItem = items.find((item) => item.key === value);
    if (addAll && value === '') {
      selcetedItem = {
        key: '',
        value: 'ALL',
      };
    }

    return (
      <div className={`selector-wrapper g-no-select ${className}`}>
        {open && <div className='selector-overlay g-overlay' onClick={() => {
          this.setState({
            open: false,
          });
        }}/>}
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
            {addAll && (
              <li
                className={value === '' ? 'selected' : ''}
                onClick={() => {
                  onChange('');
                  this.setState({
                    open: false,
                  });
                }}
              >
                <span className="select-arrow" />
                ALL
              </li>
            )}
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
                  <span className="select-arrow" />
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
  addAll: false,
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
  addAll: PropTypes.bool,
};