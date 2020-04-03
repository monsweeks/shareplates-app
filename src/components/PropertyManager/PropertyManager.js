import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './PropertyManager.scss';

const tabs = [
  {
    key: 'home',
    name: '홈',
  },
  {
    key: 'insert',
    name: '삽입',
  },
];

class PropertyManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: null,
    };
  }

  render() {
    const { t, className } = this.props;
    const { showPageList, setShowPageList, createPage } = this.props;

    const { selectedTab } = this.state;

    console.log(t);

    return (
      <div className={`property-manager g-no-select ${className}`}>
        <div className="context-menu">
          <ul>
            {tabs.map((tab) => {
              return (
                <li
                  onClick={() => {
                    this.setState({
                      selectedTab: tab.key,
                    });
                  }}
                  key={tab.key}
                  className={`item ${tab.key === selectedTab ? 'selected' : ''}`}
                >
                  <div>{tab.name}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sub-menu">
          {selectedTab === 'home' && (
            <ul>
              <li
                className="item"
                onClick={() => {
                  createPage();
                }}
              >
                <div>새 페이지</div>
              </li>
              <li className="separator">
                <div />
              </li>
              <li
                className="item"
                onClick={() => {
                  setShowPageList(!showPageList);
                }}
              >
                <div>
                  <i className="fal fa-window" />
                </div>
              </li>
            </ul>
          )}
          {selectedTab === 'insert' && (
            <ul>
              <li
                className="item"
                onClick={() => {
                  createPage();
                }}
              >
                <div>새 페이지</div>
              </li>
              <li className="item">
                <div>텍스트 상자</div>
              </li>
              <li className="separator">
                <div />
              </li>
            </ul>
          )}
        </div>
      </div>
    );
  }
}

PropertyManager.propTypes = {
  t: PropTypes.func,
  className: PropTypes.string,
  showPageList: PropTypes.bool,
  setShowPageList: PropTypes.func,
  createPage: PropTypes.func,
};

export default withRouter(withTranslation()(PropertyManager));
