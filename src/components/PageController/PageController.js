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
import SelectControl from '@/components/PageController/SelectControl/SelectControl';
import { FONT_FAMILIES, FONT_SIZES } from './data';
import ColorControl from '@/components/PageController/ColorControl/ColorControl';

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
      lastColors: {},
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

  onChangeColor = (optionKey, color) => {
    const { onChangeOption } = this.props;
    const { lastColors } = this.state;
    const next = { ...lastColors };
    next[optionKey] = color;
    this.setState({
      lastColors: next,
    });
    onChangeOption(optionKey, color);
  };

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
    const { selectedTab, lastColors } = this.state;

    console.log(itemOptions);

    const fontFamily = itemOptions.fontFamily
      ? FONT_FAMILIES.find((info) => info.value === itemOptions.fontFamily)
      : {};
    const fontSize = itemOptions.fontSize ? FONT_SIZES.find((info) => info.value === itemOptions.fontSize) : {};

    return (
      <div className={`page-controller-wrapper g-no-select ${className}`}>
        <div className="controller-menu">
          <div className="context-menu">
            <ControllerTabs
              tabs={tabs}
              currentTab={selectedTab}
              onClick={(key) => {
                this.setState({
                  selectedTab: key,
                });
              }}
            />
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
                  active={!!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-left" />
                </CheckControl>
                <CheckControl
                  optionKey="textAlign"
                  optionValue="center"
                  active={!!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-center" />
                </CheckControl>
                <CheckControl
                  optionKey="textAlign"
                  optionValue="right"
                  active={!!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-right" />
                </CheckControl>
                <CheckControl
                  optionKey="textAlign"
                  optionValue="justify"
                  active={!!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-justify" />
                </CheckControl>
                <SelectControl
                  minWidth="120px"
                  height="140px"
                  optionKey="fontFamily"
                  list={FONT_FAMILIES}
                  active={!!itemOptions.fontFamily}
                  value={itemOptions.fontFamily}
                  onSelect={onChangeOption}
                >
                  <span>{fontFamily ? fontFamily.name : itemOptions.fontFamily}</span>
                </SelectControl>
                <SelectControl
                  minWidth="64px"
                  height="140px"
                  optionKey="fontSize"
                  list={FONT_SIZES}
                  active={!!itemOptions.fontSize}
                  value={itemOptions.fontSize}
                  onSelect={onChangeOption}
                >
                  <span>{fontSize ? fontSize.name : itemOptions.fontSize}</span>
                </SelectControl>
                <ColorControl
                  colorPickerWidth="257px"
                  colorPickerHeight="200px"
                  optionKey="color"
                  active={!!itemOptions.color}
                  value={itemOptions.color}
                  onSelect={this.onChangeColor}
                  lastColor={lastColors.color || itemOptions.color}
                >
                  <span className="color-border">
                    가
                    <span
                      className="color-bar"
                      style={{
                        backgroundColor: lastColors.color || itemOptions.color,
                      }}
                    />
                  </span>
                </ColorControl>
                <ColorControl
                  colorPickerWidth="257px"
                  colorPickerHeight="200px"
                  optionKey="backgroundColor"
                  active={!!itemOptions.backgroundColor}
                  value={itemOptions.backgroundColor}
                  onSelect={this.onChangeColor}
                  lastColor={lastColors.backgroundColor || itemOptions.backgroundColor}
                >
                  <span className="color-border fill-color">
                    <i className="fal fa-fill" />
                    <span
                      className="color-bar"
                      style={{
                        backgroundColor: lastColors.backgroundColor || itemOptions.backgroundColor,
                      }}
                    />
                  </span>
                </ColorControl>
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
