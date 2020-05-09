import React from 'react';
import PropTypes from 'prop-types';
import './Tabs.scss';

class Tabs extends React.PureComponent {
  render() {
    const { className, tabTitle, tabs, tab, onChange } = this.props;

    return (
      <div className={`tabs-wrapper ${className}`}>
        <div className="sub-title">{tabTitle}</div>
        {tabs.map((item) => {
          return (
            <div
              key={item.value}
              className={`tab-item ${item.value === tab ? 'selected' : ''}`}
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
};

export default Tabs;
