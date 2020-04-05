import React from 'react';
import PropTypes from 'prop-types';
import './SelectControl.scss';

class SelectControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { active } = this.props;
    const { open } = this.state;
    if (prevProps.active && !active && open) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        open: false,
      });
    }
  }

  render() {
    const { className, optionKey, min, active, value, onSelect, children, type, list } = this.props;
    const { open } = this.state;

    return (
      <div
        style={{
          minWidth: min,
        }}
        className={`select-control-wrapper ${className} type-${type} ${active ? 'active' : 'in-active'} ${
          open ? 'open' : ''
        }`}
        onClick={() => {
          if (active) {
            this.setState({
              open: !open,
            });
          }
        }}
      >
        {open && (
          <div
            className="bg-clicker"
            onClick={() => {
              this.setState({
                open: false,
              });
            }}
          />
        )}
        <div className="select-control-content">
          <div className="select-content">{children}</div>
          <div className="bullet">
            <i className="far fa-angle-down" />
          </div>
        </div>
        <ul className={`select-control-list scrollbar ${active && open ? 'open' : ''}`}>
          {list.map((item) => {
            return (
              <li
                key={item.value}
                className={value === item.value ? 'selected' : ''}
                onClick={() => {
                  onSelect(optionKey, item.value);
                }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

SelectControl.defaultProps = {
  className: '',
};

SelectControl.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  active: PropTypes.bool,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  children: PropTypes.node,
  list: PropTypes.arrayOf(PropTypes.any),
  optionKey: PropTypes.string,
  min: PropTypes.string,
};

export default SelectControl;
