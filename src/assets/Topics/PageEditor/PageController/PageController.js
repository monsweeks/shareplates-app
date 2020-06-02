import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import { Button } from '@/components';
import CheckControl from '@/assets/Topics/PageEditor/PageController/CheckControl/CheckControl';
import ButtonControl from '@/assets/Topics/PageEditor/PageController/ButtonControl/ButtonControl';
import Separator from '@/assets/Topics/PageEditor/PageController/Separator/Separator';
import ControllerTabs from '@/assets/Topics/PageEditor/PageController/ControllerTabs/ControllerTabs';
import SelectControl from '@/assets/Topics/PageEditor/PageController/SelectControl/SelectControl';
import {
  CHAPTER_FONT_FAMILIES,
  CHAPTER_FONT_SIZES,
  ITEM_FONT_FAMILIES,
  ITEM_FONT_SIZES,
  PAGE_FONT_FAMILIES,
  PAGE_FONT_SIZES,
  TOPIC_FONT_FAMILIES,
  TOPIC_FONT_SIZES,
} from './constants';
import ColorControl from '@/assets/Topics/PageEditor/PageController/ColorControl/ColorControl';
import PaddingControl from '@/assets/Topics/PageEditor/PageController/PaddingControl/PaddingControl';
import BorderControl from '@/assets/Topics/PageEditor/PageController/BorderControl/BorderControl';
import SizeControl from '@/assets/Topics/PageEditor/PageController/SizeControl/SizeControl';
import './PageController.scss';
import LevelProperties from '@/assets/Topics/PageEditor/PageController/LevelProperties/LevelProperties';

const tabs = [
  {
    key: 'home',
    name: '홈',
  },
  {
    key: 'insert',
    name: '삽입',
  },
  {
    key: 'image',
    name: '이미지',
  },
  {
    key: 'page-property',
    name: '페이지 속성',
  },
  {
    key: 'chapter-property',
    name: '챕터 속성',
  },
  {
    key: 'topic-property',
    name: '토픽 속성',
  },
];

class PageController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'insert',
      selectedItemId: null,
      lastProperties: {},
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

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  onMemoryAndChangeOption = (optionKey, color) => {
    const { onChangeOption } = this.props;
    const { lastProperties } = this.state;
    const next = { ...lastProperties };
    next[optionKey] = color;
    this.setState({
      lastProperties: next,
    });
    onChangeOption(optionKey, color);
  };

  getBorderColor = (value, defaultColor) => {
    if (!value || value === 'none') {
      return defaultColor;
    }

    const items = value.split(' ');
    if (items.length === 3) {
      return items[2];
    }
    return defaultColor;
  };

  getFontFamilyName = (list, fontFamily) => {
    const font = list.find((info) => info.value === fontFamily);
    if (font) {
      return font.name;
    }

    return fontFamily;
  };

  getFontSizeName = (list, fontSize) => {
    const font = list.find((info) => info.value === fontSize);
    if (font) {
      return font.name;
    }

    return fontSize;
  };

  render() {
    const { t, className } = this.props;
    const {
      topicId,
      chapterId,
      pageId,
      showPageList,
      setShowPageList,
      createPage,
      addItem,
      updateContent,
      itemOptions,
      onChangeOption,
      setEditing,
      onChangeTopicProperties,
      onChangeChapterProperties,
      onChangePageProperties,
      pageProperties,
      topicProperties,
      chapterProperties,
    } = this.props;
    const { selectedTab, lastProperties } = this.state;

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
                  dataTip={t('새로운 페이지 추가')}
                  onClick={() => {
                    createPage();
                  }}
                >
                  {t('새 페이지')}
                </ButtonControl>
                <Separator />
                <ButtonControl
                  dataTip={t('페이지 목록 보임/숨김')}
                  icon
                  onClick={() => {
                    setShowPageList(!showPageList);
                  }}
                >
                  <i className="fal fa-window" />
                </ButtonControl>
                <Separator />
                <CheckControl
                  dataTip={t('왼쪽 정렬')}
                  optionKey="textAlign"
                  optionValue="left"
                  active={!!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-left" />
                </CheckControl>
                <CheckControl
                  dataTip={t('가운데 정렬')}
                  optionKey="textAlign"
                  optionValue="center"
                  active={!!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-center" />
                </CheckControl>
                <CheckControl
                  dataTip={t('오른쪽 정렬')}
                  optionKey="textAlign"
                  optionValue="right"
                  active={!!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-right" />
                </CheckControl>
                <CheckControl
                  dataTip={t('양쪽 정렬')}
                  optionKey="textAlign"
                  optionValue="justify"
                  active={!!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-justify" />
                </CheckControl>
                <Separator />
                <CheckControl
                  dataTip={t('위쪽 맞춤')}
                  optionKey="alignSelf"
                  optionValue="baseline"
                  active={!!itemOptions.alignSelf}
                  value={itemOptions.alignSelf}
                  onClick={onChangeOption}
                >
                  <span className="align-self-control baseline">
                    <span className="line" />
                    <span className="box-1" />
                    <span className="box-2" />
                  </span>
                </CheckControl>
                <CheckControl
                  dataTip={t('가운데 맞춤')}
                  optionKey="alignSelf"
                  optionValue="center"
                  active={!!itemOptions.alignSelf}
                  value={itemOptions.alignSelf}
                  onClick={onChangeOption}
                >
                  <span className="align-self-control center">
                    <span className="line" />
                    <span className="box-1" />
                    <span className="box-2" />
                  </span>
                </CheckControl>
                <CheckControl
                  dataTip={t('아래쪽 맞춤')}
                  optionKey="alignSelf"
                  optionValue="flex-end"
                  active={!!itemOptions.alignSelf}
                  value={itemOptions.alignSelf}
                  onClick={onChangeOption}
                >
                  <span className="align-self-control flex-end">
                    <span className="line" />
                    <span className="box-1" />
                    <span className="box-2" />
                  </span>
                </CheckControl>
                <Separator />
                <Separator />
                <SelectControl
                  dataTip={t('폰트')}
                  minWidth="120px"
                  height="140px"
                  optionKey="fontFamily"
                  list={ITEM_FONT_FAMILIES}
                  active={!!itemOptions.fontFamily}
                  value={itemOptions.fontFamily}
                  onSelect={onChangeOption}
                >
                  <span>{this.getFontFamilyName(ITEM_FONT_FAMILIES, itemOptions.fontFamily)}</span>
                </SelectControl>
                <SelectControl
                  dataTip={t('폰트 크기')}
                  minWidth="64px"
                  height="140px"
                  optionKey="fontSize"
                  list={ITEM_FONT_SIZES}
                  active={!!itemOptions.fontSize}
                  value={itemOptions.fontSize}
                  onSelect={onChangeOption}
                >
                  <span>{this.getFontSizeName(ITEM_FONT_SIZES, itemOptions.fontSize)}</span>
                </SelectControl>
                <Separator />
                <ColorControl
                  dataTip={t('폰트 색상')}
                  colorPickerWidth="257px"
                  colorPickerHeight="200px"
                  optionKey="color"
                  active={!!itemOptions.color}
                  value={itemOptions.color}
                  onSelect={this.onMemoryAndChangeOption}
                  lastColor={lastProperties.color || itemOptions.color}
                  clearColor="inherit"
                >
                  <span className="color-border">
                    가
                    <span
                      className="color-bar"
                      style={{
                        backgroundColor: lastProperties.color || itemOptions.color,
                      }}
                    />
                  </span>
                </ColorControl>
                <Separator />
                <ColorControl
                  dataTip={t('상자 배경 색상')}
                  colorPickerWidth="257px"
                  colorPickerHeight="200px"
                  optionKey="backgroundColor"
                  active={!!itemOptions.backgroundColor}
                  value={itemOptions.backgroundColor}
                  onSelect={this.onMemoryAndChangeOption}
                  lastColor={lastProperties.backgroundColor || itemOptions.backgroundColor}
                >
                  <span className="color-border fill-color">
                    <i className="fal fa-fill" />
                    <span
                      className="color-bar"
                      style={{
                        backgroundColor: lastProperties.backgroundColor || itemOptions.backgroundColor,
                      }}
                    />
                  </span>
                </ColorControl>
                <Separator />
                <PaddingControl
                  dataTip={t('내부 간격')}
                  optionKey="padding"
                  active={!!itemOptions.padding}
                  value={itemOptions.padding}
                  onApply={onChangeOption}
                />
                <Separator />
                <BorderControl
                  dataTip={t('경계선')}
                  colorPickerWidth="257px"
                  colorPickerHeight="200px"
                  optionKey="border"
                  active={!!itemOptions.border}
                  value={itemOptions.border}
                  onSelect={this.onMemoryAndChangeOption}
                  lastValue={lastProperties.border || itemOptions.border}
                >
                  <span className="current-border">
                    <span
                      className="rect"
                      style={{
                        borderColor: this.getBorderColor(
                          lastProperties.border || itemOptions.border,
                          'rgba(0,0,0,0.4)',
                        ),
                      }}
                    />
                  </span>
                </BorderControl>
                <Separator />
                <SizeControl
                  dataTip={t('상자 너비')}
                  icon={<i className="fal fa-arrows-h" />}
                  optionKey="wrapperWidth"
                  optionValue={itemOptions.wrapperWidth}
                  unitKey="wrapperWidthUnit"
                  unitValue={itemOptions.wrapperWidthUnit}
                  active={!!itemOptions.wrapperWidth}
                  onApply={onChangeOption}
                  setEditing={setEditing}
                />
                <SizeControl
                  dataTip={t('상자 높이')}
                  icon={<i className="fal fa-arrows-v" />}
                  optionKey="wrapperHeight"
                  optionValue={itemOptions.wrapperHeight}
                  unitKey="wrapperHeightUnit"
                  unitValue={itemOptions.wrapperHeightUnit}
                  active={!!itemOptions.wrapperHeight}
                  onApply={onChangeOption}
                  setEditing={setEditing}
                />
              </>
            )}
            {selectedTab === 'insert' && (
              <>
                <ButtonControl
                  dataTip={t('새로운 페이지 추가')}
                  onClick={() => {
                    createPage();
                  }}
                >
                  {t('새 페이지')}
                </ButtonControl>
                <Separator />
                <ButtonControl
                  dataTip={t('텍스트 상자 추가')}
                  onClick={() => {
                    addItem('Text');
                  }}
                >
                  {t('텍스트 상자')}
                </ButtonControl>
                <ButtonControl
                  dataTip={t('이미지 상자 추가')}
                  onClick={() => {
                    addItem('Image');
                  }}
                >
                  {t('이미지')}
                </ButtonControl>
                <ButtonControl
                  dataTip={t('테이블 추가')}
                  onClick={() => {
                    addItem('Table');
                  }}
                >
                  {t('테이블')}
                </ButtonControl>
              </>
            )}
            {selectedTab === 'image' && (
              <>
                <CheckControl
                  dataTip={t('이미지 원본 비율 유지')}
                  optionKey="keepingRatio"
                  optionValue="Y"
                  active={!!itemOptions.keepingRatio}
                  value={itemOptions.keepingRatio}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-sliders-h-square" />
                </CheckControl>
                <CheckControl
                  dataTip={t('이미지 비율 유지 안함')}
                  optionKey="keepingRatio"
                  optionValue="N"
                  active={!!itemOptions.keepingRatio}
                  value={itemOptions.keepingRatio}
                  onClick={onChangeOption}
                >
                  <i className="fad fa-sliders-h-square" />
                </CheckControl>
                <Separator />
                <SizeControl
                  dataTip={t('이미지 너비')}
                  icon={<i className="fal fa-arrows-h" />}
                  optionKey="width"
                  optionValue={itemOptions.width}
                  unitKey="widthUnit"
                  unitValue={itemOptions.widthUnit}
                  active={!!itemOptions.width}
                  onApply={(unitKey, unitValue) => {
                    if (unitKey === 'width') {
                      if (itemOptions.keepingRatio) {
                        const obj = {};
                        obj[unitKey] = unitValue;
                        obj.height = Math.round(unitValue * itemOptions.ratio * 100) / 100;
                        obj.heightUnit = itemOptions.widthUnit;
                        onChangeOption(obj);
                      } else {
                        onChangeOption(unitKey, unitValue);
                      }
                    } else if (itemOptions.keepingRatio) {
                      const obj = {};
                      obj[unitKey] = unitValue;
                      obj.height = Math.round(itemOptions.width * itemOptions.ratio * 100) / 100;
                      obj.heightUnit = unitValue;
                      onChangeOption(obj);
                    } else {
                      onChangeOption(unitKey, unitValue);
                    }
                  }}
                  setEditing={setEditing}
                />
                <SizeControl
                  dataTip={t('이미지 높이')}
                  icon={<i className="fal fa-arrows-v" />}
                  optionKey="height"
                  optionValue={itemOptions.height}
                  unitKey="heightUnit"
                  unitValue={itemOptions.heightUnit}
                  active={!!itemOptions.height}
                  onApply={(unitKey, unitValue) => {
                    if (unitKey === 'height') {
                      if (itemOptions.keepingRatio) {
                        const obj = {};
                        obj[unitKey] = unitValue;
                        obj.width = Math.round(unitValue * (1 / itemOptions.ratio) * 100) / 100;
                        obj.widthUnit = itemOptions.heightUnit;
                        onChangeOption(obj);
                      } else {
                        onChangeOption(unitKey, unitValue);
                      }
                    } else if (itemOptions.keepingRatio) {
                      const obj = {};
                      obj[unitKey] = unitValue;
                      obj.width = Math.round(itemOptions.height * (1 / itemOptions.ratio) * 100) / 100;
                      obj.widthUnit = unitValue;
                      onChangeOption(obj);
                    } else {
                      onChangeOption(unitKey, unitValue);
                    }
                  }}
                  setEditing={setEditing}
                />
                <Separator />
                <SizeControl
                  dataTip={t('모서리 곡선')}
                  icon={<i className="fal fa-arrows-h" />}
                  optionKey="borderRadius"
                  optionValue={itemOptions.borderRadius}
                  unitKey="borderRadiusUnit"
                  unitValue={itemOptions.borderRadiusUnit}
                  active={!!itemOptions.borderRadius}
                  onApply={onChangeOption}
                  setEditing={setEditing}
                />
                <Separator />
                <ButtonControl
                  enabled={!!itemOptions.naturalWidth}
                  dataTip={t('이미지 원본 크기로')}
                  icon
                  onClick={() => {
                    onChangeOption({
                      width: itemOptions.naturalWidth,
                      widthUnit: 'px',
                      height: itemOptions.naturalHeight,
                      heightUnit: 'px',
                    });
                  }}
                >
                  <i className="fal fa-window" />
                </ButtonControl>
                <ButtonControl
                  enabled={!!itemOptions.naturalWidth}
                  dataTip={t('박스 크기에 맞춤')}
                  icon
                  onClick={() => {
                    onChangeOption({
                      width: 'auto',
                      widthUnit: '%',
                      height: '100',
                      heightUnit: '%',
                    });
                  }}
                >
                  <i className="fal fa-window" />
                </ButtonControl>
              </>
            )}
            {selectedTab === 'page-property' && (
              <LevelProperties
                level="페이지"
                fontSizes={PAGE_FONT_SIZES}
                fontFamilies={PAGE_FONT_FAMILIES}
                onChangeProperties={onChangePageProperties}
                properties={pageProperties}
                active={!!pageId}
              />
            )}
            {selectedTab === 'chapter-property' && (
              <LevelProperties
                level="챕터"
                fontSizes={CHAPTER_FONT_SIZES}
                fontFamilies={CHAPTER_FONT_FAMILIES}
                onChangeProperties={onChangeChapterProperties}
                properties={chapterProperties}
                active={!!chapterId}
              />
            )}
            {selectedTab === 'topic-property' && (
              <LevelProperties
                level="토픽"
                fontSizes={TOPIC_FONT_SIZES}
                fontFamilies={TOPIC_FONT_FAMILIES}
                onChangeProperties={onChangeTopicProperties}
                properties={topicProperties}
                active={!!topicId}
              />
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
            disabled={!pageId}
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
  topicId: PropTypes.number,
  chapterId: PropTypes.number,
  pageId: PropTypes.number,
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
  setEditing: PropTypes.func,
  onChangeTopicProperties: PropTypes.func,
  onChangeChapterProperties: PropTypes.func,
  onChangePageProperties: PropTypes.func,
  topicProperties: PropTypes.objectOf(PropTypes.any),
  chapterProperties: PropTypes.objectOf(PropTypes.any),
  pageProperties: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(withTranslation()(PageController));
