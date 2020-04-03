import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './PageController.scss';
import { Button } from '@/components';

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

class PageController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'insert',
    };
  }

  render() {
    const { t, className } = this.props;
    const { showPageList, setShowPageList, createPage, addItem, updateContent } = this.props;
    const { selectedTab } = this.state;

    return (
      <div className={`page-controller-wrapper g-no-select ${className}`}>
        <div className="controller-menu">
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
                  <div>{t('새 페이지')}</div>
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
                <li
                  className="item"
                  onClick={() => {
                    addItem('text');
                  }}
                >
                  <div>텍스트 상자</div>
                </li>
                <li className="separator">
                  <div />
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="always-menu">
          <Button
            color="white"
            size="sm"
            onClick={() => {
              updateContent();
            }}
          >
            <i className="fas fa-save" /> 저장
          </Button>
        </div>
      </div>
    );
  }
}

PageController.propTypes = {
  t: PropTypes.func,
  className: PropTypes.string,
  showPageList: PropTypes.bool,
  setShowPageList: PropTypes.func,
  createPage: PropTypes.func,
  addItem: PropTypes.func,
  updateContent: PropTypes.func,
};

export default withRouter(withTranslation()(PageController));
