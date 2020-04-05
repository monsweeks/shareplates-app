import React from 'react';
import PropTypes from 'prop-types';
import './SelectControl.scss';

class SelectControl extends React.Component {
  control = React.createRef();

  list = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { active } = this.props;
    const { open } = this.state;
    if (prevProps.active && !active && open) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        open: false,
      });
    }

    if (!prevState.open && open) {
      document.addEventListener('mousedown', this.onOutsideClick);
      this.adjustScroll();
    }

    if (prevState.open && !open) {
      document.removeEventListener('mousedown', this.onOutsideClick);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideClick);
  }

  onOutsideClick = (e) => {
    if (!this.control.current.contains(e.target)) {
      this.setState({
        open: false,
      });
    }
  };

  adjustScroll = () => {
    this.list.current.scrollTop = this.list.current.querySelector('.selected').offsetTop;
  };

  render() {
    const { className, optionKey, minWidth, height, active, value, onSelect, children, list } = this.props;
    const { open } = this.state;

    return (
      <div
        ref={this.control}
        style={{
          minWidth,
        }}
        className={`select-control-wrapper ${className} ${active ? 'active' : 'in-active'} ${
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
        <div className="select-control-content">
          <div className="select-content">{children}</div>
          <div className="bullet">
            <i className="far fa-angle-down" />
          </div>
        </div>
        <ul
          ref={this.list}
          className={`select-control-list scrollbar ${active && open ? 'open' : ''}`}
          style={{
            height,
          }}
        >
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
  active: PropTypes.bool,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  children: PropTypes.node,
  list: PropTypes.arrayOf(PropTypes.any),
  optionKey: PropTypes.string,
  minWidth: PropTypes.string,
  height: PropTypes.string,
};

export default SelectControl;
