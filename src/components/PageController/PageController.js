import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './PageController.scss';
import { Button } from '@/components';
import CheckControl from '@/components/PageController/CheckControl/CheckControl';
import ButtonControl from '@/components/PageController/ButtonControl/ButtonControl';
import Separator from '@/components/PageController/Separator/Separator';
import ControllerTabs from '@/components/PageController/ControllerTabs/ControllerTabs';

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
      selectedItemId: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.selectedItemId && state.selectedItemId) {
      return {
        selectedItemId: null,
      };
    }

    if (props.selectedItemId && props.selectedItemId !== state.selectedItemId) {
      return {
        selectedItemId: props.selectedItemId,
        selectedTab: 'home',
      };
    }

    return null;
  }

  render() {
    const { t, className } = this.props;
    const {
      showPageList,
      setShowPageList,
      createPage,
      addItem,
      updateContent,
      itemOptions,
      onChangeOption,
    } = this.props;
    const { selectedTab } = this.state;

    console.log(itemOptions);

    return (
      <div className={`page-controller-wrapper g-no-select ${className}`}>
        <div className="controller-menu">
          <div className="context-menu">
            <ControllerTabs tabs={tabs} currentTab={selectedTab} onClick={(key) => {
              this.setState({
                selectedTab: key,
              });
            }} />
          </div>
          <div className="sub-menu">
            {selectedTab === 'home' && (
              <>
                <ButtonControl
                  onClick={() => {
                    createPage();
                  }}
                >
                  {t('새 페이지')}
                </ButtonControl>
                <Separator />
                <ButtonControl
                  icon
                  onClick={() => {
                    setShowPageList(!showPageList);
                  }}
                >
                  <i className="fal fa-window" />
                </ButtonControl>
                <Separator />
                <CheckControl
                  optionKey="textAlign"
                  optionValue="left"
                  active={itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-left" />
                </CheckControl>
                <CheckControl
                  optionKey="textAlign"
                  optionValue="center"
                  active={itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-center" />
                </CheckControl>
                <CheckControl
                  optionKey="textAlign"
                  optionValue="right"
                  active={itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-right" />
                </CheckControl>
                <CheckControl
                  optionKey="textAlign"
                  optionValue="justify"
                  active={itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-justify" />
                </CheckControl>
              </>
            )}
            {selectedTab === 'insert' && (
              <>
                <ButtonControl
                  onClick={() => {
                    createPage();
                  }}
                >
                  {t('새 페이지')}
                </ButtonControl>
                <Separator />
                <ButtonControl
                  onClick={() => {
                    addItem('Text');
                  }}
                >
                  {t('텍스트 상자')}
                </ButtonControl>
              </>
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

PageController.defaultProps = {
  className: '',
};

PageController.propTypes = {
  t: PropTypes.func,
  className: PropTypes.string,
  showPageList: PropTypes.bool,
  setShowPageList: PropTypes.func,
  createPage: PropTypes.func,
  addItem: PropTypes.func,
  updateContent: PropTypes.func,
  itemOptions: PropTypes.objectOf(PropTypes.any),
  onChangeOption: PropTypes.func,
  selectedItemId: PropTypes.string,
};

export default withRouter(withTranslation()(PageController));
