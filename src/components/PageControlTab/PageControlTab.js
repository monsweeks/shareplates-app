import React from 'react';
import PropTypes from 'prop-types';
import './PageControlTab.scss';

class PageControlTab extends React.PureComponent {
  render() {
    const { className, tabTitle, tabs, tab, onChange } = this.props;

    return (
      <div className={`page-control-tabs-wrapper ${className}`}>
        <div className="sub-title">{tabTitle}</div>
        {tabs.map((item) => {
          return (
            <div
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

PageControlTab.defaultProps = {
  className: '',
};

PageControlTab.propTypes = {
  className: PropTypes.string,
  tabs: PropTypes.arrayOf({
    value: PropTypes.string,
    name: PropTypes.string,
  }),
  tab: PropTypes.string,
  tabTitle: PropTypes.string,
  onChange: PropTypes.func,
};

export default PageControlTab;
