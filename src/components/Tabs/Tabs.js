import React from 'react';
import PropTypes from 'prop-types';
import './Tabs.scss';

class Tabs extends React.PureComponent {
  render() {
    const { className, tabTitle, tabs, tab, onChange, left, buttonStyle, tabColor } = this.props;

    return (
      <div className={`tabs-wrapper ${className} ${left ? 'left' : ''} ${buttonStyle ? 'button-style' : ''}`}>
        {tabTitle && <div className="sub-title">{tabTitle}</div>}
        {tabs.map((item) => {
          return (
            <div
              key={item.value}
              className={`tab-item ${item.value === tab ? 'selected' : ''}`}
              style={{
                backgroundColor : tabColor
              }}
              onClick={() => {
                onChange(item.value);
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );
  }
}

Tabs.defaultProps = {
  className: '',
  left: false,
  buttonStyle: false,
  tabColor : ''
};

Tabs.propTypes = {
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  tab: PropTypes.string,
  tabTitle: PropTypes.string,
  onChange: PropTypes.func,
  left: PropTypes.bool,
  buttonStyle: PropTypes.bool,
  tabColor : PropTypes.string,
};

export default Tabs;
