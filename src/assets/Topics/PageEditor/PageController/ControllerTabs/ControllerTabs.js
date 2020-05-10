import React from 'react';
import PropTypes from 'prop-types';
import './ControllerTabs.scss';

class ControllerTabs extends React.PureComponent {
  render() {
    const { className, onClick, tabs, currentTab } = this.props;

    return (
      <div className={`controller-tabs-wrapper ${className}`}>
        {tabs.map((tab) => {
          return (
            <div
              onClick={() => {
                onClick(tab.key);
              }}
              key={tab.key}
              className={`${tab.key === currentTab ? 'selected' : ''}`}
            >
              <div>{tab.name}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

ControllerTabs.defaultProps = {
  className: '',
};

ControllerTabs.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  tabs: PropTypes.arrayOf(PropTypes.any),
  currentTab: PropTypes.string,
};

export default ControllerTabs;
