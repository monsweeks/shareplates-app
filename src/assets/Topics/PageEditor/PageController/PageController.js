import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import CheckControl from '@/assets/Topics/PageEditor/PageController/CheckControl/CheckControl';
import ButtonControl from '@/assets/Topics/PageEditor/PageController/ButtonControl/ButtonControl';
import Separator from '@/assets/Topics/PageEditor/PageController/Separator/Separator';
import ControllerTabs from '@/assets/Topics/PageEditor/PageController/ControllerTabs/ControllerTabs';
import SelectControl from '@/assets/Topics/PageEditor/PageController/SelectControl/SelectControl';
import { ITEM_FONT_FAMILIES, ITEM_FONT_SIZES, LIST_STYLES, TEXT_DECORATION_STYLES } from './constants';
import ColorControl from '@/assets/Topics/PageEditor/PageController/ColorControl/ColorControl';
import PaddingControl from '@/assets/Topics/PageEditor/PageController/PaddingControl/PaddingControl';
import BorderControl from '@/assets/Topics/PageEditor/PageController/BorderControl/BorderControl';
import SizeControl from '@/assets/Topics/PageEditor/PageController/SizeControl/SizeControl';
import './PageController.scss';
import LevelPropertiesPopup from '@/assets/Topics/PageEditor/PageController/LevelPropertiesPopup/LevelPropertiesPopup';
import contentUtil from '@/utils/contentUtil';

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
    key: 'table',
    name: '테이블',
  },
  {
    key: 'list',
    name: '리스트',
  },
  {
    key: 'global-property',
    name: '문서 속성',
  },
];

class PageController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'insert',
      selectedItemId: null,
      lastProperties: {},
      openLevelPropertiesPopup: false,
    };

    this.selectionChangeDebounced = debounce(this.onSelectionChange, 200);
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
    document.addEventListener('selectionchange', this.selectionChangeDebounced);
  }

  componentWillUnmount() {
    document.removeEventListener('selectionchange', this.selectionChangeDebounced);
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  onSelectionChange = () => {
    this.forceUpdate();
  };

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

  getListText = (list, value, pageValue) => {
    let item;
    if (value === 'inherit') {
      item = list.find((info) => info.value === pageValue);
      if (item) {
        return (
          <span>
            {item.name} <span className="global-property-mark">*</span>
          </span>
        );
      }
    }

    item = list.find((info) => info.value === value);
    if (item) {
      return item.name;
    }

    return value;
  };

  getSelectionStyleContent = (styleKey, styleValue) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rootElement = selection.focusNode.parentElement.closest('[contenteditable]');
    const rootChildNodes = rootElement.childNodes;
    let next = '';
    let crossChangeStart = false;

    for (let i = 0; i < rootChildNodes.length; i += 1) {
      // 같은 레벨의 컨테이너의 텍스트를 선택하고, 부모가 editable인 경우, 선택한 부분만 스팬으로 쪼개고, 스타일 추가
      if (
        rootChildNodes[i] === range.startContainer &&
        range.startContainer.nodeType === 3 &&
        range.startContainer === range.endContainer &&
        range.endContainer.parentElement === rootElement
      ) {
        const text = range.startContainer.nodeValue;
        const span = document.createElement('span');
        span.textContent = text.substring(range.startOffset, range.endOffset);
        span.style[styleKey] = styleValue;
        next += `${text.substring(0, range.startOffset)}${span.outerHTML}${text.substring(
          range.endOffset,
          text.length,
        )}`;
      }
      // 같은 레벨의 컨테이너의 스팬을 선택한 경우, 스팬을 복사해서 앞/뒤로 쪼개고, 선택 부분에 스타일 추가
      else if (
        rootChildNodes[i] === range.startContainer.parentElement &&
        range.startContainer.parentElement.nodeType !== 3 &&
        range.startContainer === range.endContainer
      ) {
        const element = range.startContainer.parentElement;
        const pre = element.cloneNode(true);
        const post = element.cloneNode(true);
        pre.textContent = element.textContent.substring(0, range.startOffset);
        post.textContent = element.textContent.substring(range.endOffset, element.textContent.length);
        element.textContent = element.textContent.substring(range.startOffset, range.endOffset);
        element.style[styleKey] = styleValue;

        if (pre.textContent !== '') {
          next += pre.outerHTML;
        }

        if (element.textContent !== '') {
          next += element.outerHTML;
        }

        if (post.textContent !== '') {
          next += post.outerHTML;
        }
      }
      // 다른 레벨의 컨테이너들을 선택하고, 시작 컨테이너인데, 텍스트인 경우, 선택 부분부터 컨테이너의 끝까지 스팬으로 묶고, 스타일 추가하고, 플래그 true
      else if (
        range.startContainer !== range.endContainer &&
        rootChildNodes[i] === range.startContainer &&
        range.startContainer.nodeType === 3
      ) {
        const text = range.startContainer.nodeValue;
        const span = document.createElement('span');
        span.textContent = text.substring(range.startOffset, text.length);
        span.style[styleKey] = styleValue;
        next += `${text.substring(0, range.startOffset)}${span.outerHTML}`;
        crossChangeStart = true;
      }
      // 다른 레벨의 컨테이너들을 선택하고, 시작 컨테이너인데, 스팬인 경우, 스팬으 쪼개고, 뒤의 스팬에 스타일 추가하고, 플래그 true
      else if (
        range.startContainer !== range.endContainer &&
        rootChildNodes[i] === range.startContainer.parentElement &&
        range.startContainer.parentElement.nodeType !== 3
      ) {
        const element = range.startContainer.parentElement;
        const pre = element.cloneNode(true);
        pre.textContent = element.textContent.substring(0, range.startOffset);
        element.textContent = element.textContent.substring(range.startOffset, element.textContent.length);
        element.style[styleKey] = styleValue;
        if (pre.textContent !== '') {
          next += pre.outerHTML;
        }
        if (element.textContent !== '') {
          next += element.outerHTML;
        }
        crossChangeStart = true;
      }
      // 플래그가 시작되었고, 마지막 컨테이너인데, 텍스트인 경우, 앞 부분을 스팬으로 묶고, 스타일을 추가하고, 플래그 종료
      else if (crossChangeStart && rootChildNodes[i] === range.endContainer && range.endContainer.nodeType === 3) {
        const text = range.endContainer.nodeValue;
        const span = document.createElement('span');
        span.textContent = text.substring(0, range.endOffset);
        span.style[styleKey] = styleValue;
        next += `${span.textContent !== '' ? span.outerHTML : ''}${text.substring(range.endOffset, text.length)}`;
        crossChangeStart = false;
      }
      // 플래그가 시작되었고, 마지막 컨테이너인데, 스팬인 경우, 스팬을 쪼개고 앞부분에 스타일을 추가하고, 플래그 종료
      else if (
        crossChangeStart &&
        rootChildNodes[i] === range.endContainer.parentElement &&
        range.endContainer.parentElement.nodeType !== 3
      ) {
        const element = range.endContainer.parentElement;
        const pre = element.cloneNode(true);
        pre.textContent = element.textContent.substring(0, range.endOffset); // 스타일 추가
        pre.style[styleKey] = styleValue;
        element.textContent = element.textContent.substring(range.endOffset, element.textContent.length);
        if (pre.textContent !== '') {
          next += pre.outerHTML;
        }

        if (element.textContent !== '') {
          next += element.outerHTML;
        }

        crossChangeStart = false;
      }
      // 플래그가 시작되고, 중간 컨테이너인데 텍스트인 경우, 전체를 스팬으로 묶고 스타일 추가
      else if (crossChangeStart && rootChildNodes[i].nodeType === 3) {
        const text = rootChildNodes[i].nodeValue;
        const span = document.createElement('span');
        span.textContent = text;
        span.style[styleKey] = styleValue;
        next += span.outerHTML;
      }
      // 플래스가 시작되고, 중간 컨테인데 스팬인 경우 스타일 추가
      else if (crossChangeStart && rootChildNodes[i].nodeType !== 3) {
        rootChildNodes[i].style[styleKey] = styleValue;
        next += rootChildNodes[i].outerHTML;
      }
      // 선택되지 않은 텍스트 노드의 경우, 단순 추가
      else if (rootChildNodes[i].nodeType === 3 && rootChildNodes[i].nodeValue !== '') {
        next += rootChildNodes[i].nodeValue;
      }
      // 선택되지 않은 스팬 노드의 경우, 단순 추가
      else if (rootChildNodes[i].nodeType !== 3) {
        next += rootChildNodes[i].outerHTML;
      }
    }

    return next;
  };

  isSelectionStyle = (item) => {
    const selection = window.getSelection();
    return item && (item.name === 'Text' || item.name === 'Table' || item.name === 'List') && !selection.isCollapsed;
  };

  getSelectionStyleValues = (isSelectionStyle, itemOptions, styleKeyList) => {
    const values = {};

    const selection = window.getSelection();
    if (
      isSelectionStyle &&
      selection.focusNode.nodeType === 3 &&
      !selection.focusNode.parentElement.getAttribute('contenteditable')
    ) {
      styleKeyList.forEach((styleKey) => {
        values[styleKey] = selection.focusNode.parentElement.style[styleKey];
      });
    } else {
      styleKeyList.forEach((styleKey) => {
        values[styleKey] = itemOptions[styleKey];
      });
    }

    return values;
  };

  setSelectionStyle = (item, next) => {
    const { childSelectedList, onChangeValue } = this.props;

    if (item.name === 'Text') {
      onChangeValue({
        text: next,
      });
    } else if (item.name === 'Table') {
      if (childSelectedList && childSelectedList.length > 0) {
        const { values } = item;
        values.rows[childSelectedList[0][0]].cols[childSelectedList[0][1]].text = next;
        onChangeValue(values, true);
      }
    } else if (item.name === 'List') {
      if (childSelectedList && childSelectedList.length > 0) {
        const { values } = item;
        values.rows[childSelectedList[0][0]].text = next;
        onChangeValue(values, true);
      }
    }
  };

  onChangeSelectionOrItemOption = (optionKey, optionValue) => {
    const { onChangeOption, item } = this.props;

    const isSelectionStyle = this.isSelectionStyle(item);

    if (isSelectionStyle) {
      const next = this.getSelectionStyleContent(optionKey, optionValue);
      this.setSelectionStyle(item, next);
    } else {
      onChangeOption(optionKey, optionValue);
    }
  };

  onChangeSelectionOrItemOptionAndMemory = (optionKey, optionValue) => {
    const { item } = this.props;

    const isSelectionStyle = this.isSelectionStyle(item);

    if (isSelectionStyle) {
      const next = this.getSelectionStyleContent(optionKey, optionValue);
      this.setSelectionStyle(item, next);
    } else {
      this.onMemoryAndChangeOption(optionKey, optionValue);
    }
  };

  onSetOpenLevelPropertiesPopup = (openLevelPropertiesPopup) => {
    this.setState({
      openLevelPropertiesPopup,
    });
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
      addChild,
      updateContent,
      itemOptions,
      onChangeOption,
      setEditing,
      onChangeGlobalProperties,
      pageProperties,
      topicProperties,
      chapterProperties,
      childSelectedList,
      item,
    } = this.props;
    const { selectedTab, lastProperties, openLevelPropertiesPopup } = this.state;

    const mergedPageProperties = contentUtil.getMergedPageProperties(
      topicProperties,
      chapterProperties,
      pageProperties,
    );

    const isTable = !!(item && item.name === 'Table');
    const isList = !!(item && item.name === 'List');
    const isImage = !!(item && item.name === 'Image');
    const isSingleChildSelected = !!(childSelectedList && childSelectedList.length === 1);
    const isSelectionStyle = this.isSelectionStyle(item);
    const selectionStyleValues = this.getSelectionStyleValues(isSelectionStyle, itemOptions, [
      'fontFamily',
      'fontSize',
      'fontWeight',
      'color',
      'backgroundColor',
      'textDecorationLine',
      'textDecorationStyle',
      'textDecorationColor',
    ]);

    return (
      <div className={`page-controller-wrapper g-no-select ${className}`}>
        <div className="controller-menu">
          <div className="context-menu">
            <ControllerTabs
              tabs={tabs}
              currentTab={selectedTab}
              onClick={(key) => {
                if (key === 'global-property') {
                  this.onSetOpenLevelPropertiesPopup(!openLevelPropertiesPopup);
                } else {
                  this.setState({
                    selectedTab: key,
                  });
                }
              }}
            />
          </div>
          <div className="sub-menu">
            {selectedTab === 'home' && (
              <>
                <ButtonControl
                  active={pageId !== null}
                  dataTip={t('페이지 저장')}
                  onClick={() => {
                    updateContent();
                  }}
                >
                  <i className="fas fa-save" /> 저장
                </ButtonControl>
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
                  active={!isSelectionStyle && !!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-left" />
                </CheckControl>
                <CheckControl
                  dataTip={t('가운데 정렬')}
                  optionKey="textAlign"
                  optionValue="center"
                  active={!isSelectionStyle && !!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-center" />
                </CheckControl>
                <CheckControl
                  dataTip={t('오른쪽 정렬')}
                  optionKey="textAlign"
                  optionValue="right"
                  active={!isSelectionStyle && !!itemOptions.textAlign}
                  value={itemOptions.textAlign}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-align-right" />
                </CheckControl>
                <CheckControl
                  dataTip={t('양쪽 정렬')}
                  optionKey="textAlign"
                  optionValue="justify"
                  active={!isSelectionStyle && !!itemOptions.textAlign}
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
                  active={!isSelectionStyle && !!itemOptions.alignSelf}
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
                  active={!isSelectionStyle && !!itemOptions.alignSelf}
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
                  active={!isSelectionStyle && !!itemOptions.alignSelf}
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
                <CheckControl
                  dataTip={t('굵게')}
                  optionKey="fontWeight"
                  optionValue="bold"
                  active={!!itemOptions.fontWeight}
                  value={selectionStyleValues.fontWeight}
                  onClick={(optionKey) => {
                    this.onChangeSelectionOrItemOption(
                      optionKey,
                      selectionStyleValues.fontWeight === 'bold' ? 'inherit' : 'bold',
                    );
                  }}
                >
                  <i className="fas fa-bold" />
                </CheckControl>
                <CheckControl
                  dataTip={t('아래선')}
                  optionKey="textDecorationLine"
                  optionValue="underline"
                  active={!!itemOptions.textDecorationLine}
                  value={selectionStyleValues.textDecorationLine}
                  onClick={(optionKey) => {
                    this.onChangeSelectionOrItemOption(
                      optionKey,
                      selectionStyleValues.textDecorationLine === 'underline' ? 'none' : 'underline',
                    );
                  }}
                >
                  <i className="fas fa-underline" />
                </CheckControl>
                <CheckControl
                  dataTip={t('윗선')}
                  optionKey="textDecorationLine"
                  optionValue="overline"
                  active={!!itemOptions.textDecorationLine}
                  value={selectionStyleValues.textDecorationLine}
                  onClick={(optionKey) => {
                    this.onChangeSelectionOrItemOption(
                      optionKey,
                      selectionStyleValues.textDecorationLine === 'overline' ? 'none' : 'overline',
                    );
                  }}
                >
                  <i className="fas fa-overline" />
                </CheckControl>
                <CheckControl
                  dataTip={t('취소선')}
                  optionKey="textDecorationLine"
                  optionValue="line-through"
                  active={!!itemOptions.textDecorationLine}
                  value={selectionStyleValues.textDecorationLine}
                  onClick={(optionKey) => {
                    this.onChangeSelectionOrItemOption(
                      optionKey,
                      selectionStyleValues.textDecorationLine === 'line-through' ? 'none' : 'line-through',
                    );
                  }}
                >
                  <i className="fas fa-strikethrough" />
                </CheckControl>
                <SelectControl
                  dataTip={t('선 타입')}
                  minWidth="60px"
                  height="auto"
                  optionKey="textDecorationStyle"
                  list={TEXT_DECORATION_STYLES}
                  active={!!itemOptions.textDecorationStyle}
                  value={selectionStyleValues.textDecorationStyle}
                  onSelect={this.onChangeSelectionOrItemOption}
                >
                  <span>{this.getListText(TEXT_DECORATION_STYLES, selectionStyleValues.textDecorationStyle)}</span>
                </SelectControl>
                <ColorControl
                  dataTip={t('선 색상')}
                  colorPickerWidth="257px"
                  colorPickerHeight="200px"
                  optionKey="textDecorationColor"
                  active={!!itemOptions.textDecorationColor}
                  value={selectionStyleValues.textDecorationColor}
                  onSelect={this.onChangeSelectionOrItemOption}
                >
                  <span className="color-border fill-color">
                    <i className="fal fa-fill" />
                    <span
                      className="color-bar"
                      style={{
                        backgroundColor: selectionStyleValues.textDecorationColor,
                      }}
                    />
                  </span>
                </ColorControl>
                <Separator />
                <SelectControl
                  dataTip={t('폰트')}
                  minWidth="80px"
                  height="140px"
                  optionKey="fontFamily"
                  list={ITEM_FONT_FAMILIES}
                  active={!!itemOptions.fontFamily}
                  value={selectionStyleValues.fontFamily}
                  onSelect={this.onChangeSelectionOrItemOption}
                >
                  <span>
                    {this.getListText(
                      ITEM_FONT_FAMILIES,
                      selectionStyleValues.fontFamily,
                      mergedPageProperties.fontFamily,
                    )}
                  </span>
                </SelectControl>
                <SelectControl
                  dataTip={t('폰트 크기')}
                  minWidth="80px"
                  height="140px"
                  optionKey="fontSize"
                  list={ITEM_FONT_SIZES}
                  active={!!itemOptions.fontSize}
                  value={selectionStyleValues.fontSize}
                  onSelect={this.onChangeSelectionOrItemOption}
                >
                  <span>{this.getListText(ITEM_FONT_SIZES, selectionStyleValues.fontSize, mergedPageProperties.fontSize)}</span>
                </SelectControl>
                <Separator />
                <ColorControl
                  dataTip={t('폰트 색상')}
                  colorPickerWidth="257px"
                  colorPickerHeight="200px"
                  optionKey="color"
                  active={!!itemOptions.color}
                  value={selectionStyleValues.color}
                  onSelect={this.onChangeSelectionOrItemOptionAndMemory}
                  lastColor={lastProperties.color || selectionStyleValues.color}
                  clearColor="inherit"
                >
                  <span className="color-border">
                    가
                    <span
                      className="color-bar"
                      style={{
                        backgroundColor: lastProperties.color || selectionStyleValues.color,
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
                  value={selectionStyleValues.backgroundColor}
                  onSelect={this.onChangeSelectionOrItemOptionAndMemory}
                  lastColor={lastProperties.backgroundColor || selectionStyleValues.backgroundColor}
                >
                  <span className="color-border fill-color">
                    <i className="fal fa-fill" />
                    <span
                      className="color-bar"
                      style={{
                        backgroundColor: lastProperties.backgroundColor || selectionStyleValues.backgroundColor,
                      }}
                    />
                  </span>
                </ColorControl>
                <Separator />
                <PaddingControl
                  dataTip={t('내부 간격')}
                  optionKey="padding"
                  active={!isSelectionStyle && !!itemOptions.padding}
                  value={itemOptions.padding}
                  onApply={onChangeOption}
                />
                <Separator />
                <BorderControl
                  dataTip={t('경계선')}
                  colorPickerWidth="257px"
                  colorPickerHeight="200px"
                  optionKey="border"
                  active={!isSelectionStyle && !!itemOptions.border}
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
                  dataTip={t('너비')}
                  icon={<i className="fal fa-arrows-h" />}
                  optionKey="width"
                  optionValue={itemOptions.width}
                  unitKey="widthUnit"
                  unitValue={itemOptions.widthUnit}
                  active={!isSelectionStyle && !!itemOptions.width}
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
                  active={!isSelectionStyle && !!itemOptions.wrapperHeight}
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
                <ButtonControl
                  dataTip={t('리스트 추가')}
                  onClick={() => {
                    addItem('List');
                  }}
                >
                  {t('리스트')}
                </ButtonControl>
              </>
            )}
            {selectedTab === 'image' && (
              <>
                <CheckControl
                  dataTip={t('이미지 원본 비율 유지')}
                  optionKey="keepingRatio"
                  optionValue="Y"
                  active={!!itemOptions.keepingRatio && isImage}
                  value={itemOptions.keepingRatio}
                  onClick={onChangeOption}
                >
                  <i className="fas fa-sliders-h-square" />
                </CheckControl>
                <CheckControl
                  dataTip={t('이미지 비율 유지 안함')}
                  optionKey="keepingRatio"
                  optionValue="N"
                  active={!!itemOptions.keepingRatio && isImage}
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
                  active={!!itemOptions.width && isImage}
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
                  active={!!itemOptions.height && isImage}
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
                  active={!!itemOptions.borderRadius && isImage}
                  onApply={onChangeOption}
                  setEditing={setEditing}
                />
                <Separator />
                <ButtonControl
                  active={!!itemOptions.naturalWidth && isImage}
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
                  active={!!itemOptions.naturalWidth && isImage}
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
            {selectedTab === 'table' && (
              <>
                <ButtonControl
                  active={isTable}
                  className="table-operation-button direction-up"
                  dataTip={t('위에 행 추가')}
                  onClick={() => {
                    addChild('add-row-top');
                  }}
                >
                  <span>
                    <i className="fal fa-table" />
                    <span>
                      <i className="fal fa-plus" />
                    </span>
                  </span>
                </ButtonControl>
                <ButtonControl
                  active={isTable}
                  className="table-operation-button direction-down"
                  dataTip={t('아래 행 추가')}
                  onClick={() => {
                    addChild('add-row-bottom');
                  }}
                >
                  <span>
                    <i className="fal fa-table" />
                    <span>
                      <i className="fal fa-plus" />
                    </span>
                  </span>
                </ButtonControl>
                <ButtonControl
                  active={isTable}
                  className="table-operation-button direction-left"
                  dataTip={t('왼쪽 열 추가')}
                  onClick={() => {
                    addChild('add-col-left');
                  }}
                >
                  <span>
                    <i className="fal fa-table" />
                    <span>
                      <i className="fal fa-plus" />
                    </span>
                  </span>
                </ButtonControl>
                <ButtonControl
                  active={isTable}
                  className="table-operation-button direction-right"
                  dataTip={t('오른쪽 열 추가')}
                  onClick={() => {
                    addChild('add-col-right');
                  }}
                >
                  <span>
                    <i className="fal fa-table" />
                    <span>
                      <i className="fal fa-plus" />
                    </span>
                  </span>
                </ButtonControl>
                <ButtonControl
                  active={isTable && isSingleChildSelected}
                  className="table-operation-button direction-up remove"
                  dataTip={t('행 삭제')}
                  onClick={() => {
                    addChild('remove-row');
                  }}
                >
                  <span>
                    <i className="fal fa-arrows-h" />
                    <span>
                      <i className="fal fa-minus" />
                    </span>
                  </span>
                </ButtonControl>
                <ButtonControl
                  active={isTable && isSingleChildSelected}
                  className="table-operation-button direction-right remove"
                  dataTip={t('열 삭제')}
                  onClick={() => {
                    addChild('remove-col');
                  }}
                >
                  <span>
                    <i className="fal fa-arrows-v" />
                    <span>
                      <i className="fal fa-minus" />
                    </span>
                  </span>
                </ButtonControl>
              </>
            )}
            {selectedTab === 'list' && (
              <>
                <SelectControl
                  dataTip={t('리스트 스타일')}
                  minWidth="64px"
                  height="140px"
                  optionKey="listStyle"
                  list={LIST_STYLES}
                  active={!!itemOptions.listStyle && isList}
                  value={itemOptions.listStyle}
                  onSelect={onChangeOption}
                >
                  <span>{this.getListText(LIST_STYLES, itemOptions.listStyle)}</span>
                </SelectControl>
                <ButtonControl
                  active={isList && !Number.isNaN(itemOptions.indentLevel)}
                  dataTip={t('들여쓰기')}
                  icon
                  onClick={() => {
                    onChangeOption('indentLevel', Number(itemOptions.indentLevel) + 1);
                  }}
                >
                  <i className="fal fa-indent" />
                </ButtonControl>
                <ButtonControl
                  active={isList && !Number.isNaN(itemOptions.indentLevel)}
                  dataTip={t('내어쓰기')}
                  icon
                  onClick={() => {
                    if (itemOptions.indentLevel > 0) {
                      onChangeOption('indentLevel', itemOptions.indentLevel - 1);
                    }
                  }}
                >
                  <i className="fal fa-outdent" />
                </ButtonControl>
                <ButtonControl
                  active={isList}
                  className="table-operation-button direction-up"
                  dataTip={t('위에 아이템 추가')}
                  onClick={() => {
                    addChild('add-item-top');
                  }}
                >
                  <span>
                    <i className="fal fa-list-ul" />
                    <span>
                      <i className="fal fa-plus" />
                    </span>
                  </span>
                </ButtonControl>
                <ButtonControl
                  active={isList}
                  className="table-operation-button direction-down"
                  dataTip={t('아래 아이템 추가')}
                  onClick={() => {
                    addChild('add-item-bottom');
                  }}
                >
                  <span>
                    <i className="fal fa-list-ul" />
                    <span>
                      <i className="fal fa-plus" />
                    </span>
                  </span>
                </ButtonControl>
                <ButtonControl
                  active={isList && isSingleChildSelected}
                  className="table-operation-button direction-up remove"
                  dataTip={t('아이템 삭제')}
                  onClick={() => {
                    addChild('remove-item');
                  }}
                >
                  <span>
                    <i className="fal fa-list-ul" />
                    <span>
                      <i className="fal fa-minus" />
                    </span>
                  </span>
                </ButtonControl>
              </>
            )}
          </div>
        </div>
        {openLevelPropertiesPopup && (
          <LevelPropertiesPopup
            topicId={topicId}
            chapterId={chapterId}
            pageId={pageId}
            pageProperties={pageProperties}
            chapterProperties={chapterProperties}
            topicProperties={topicProperties}
            onChangeGlobalProperties={onChangeGlobalProperties}
            onSetOpenLevelPropertiesPopup={this.onSetOpenLevelPropertiesPopup}
            onCancel={() => {
              this.onSetOpenLevelPropertiesPopup(false);
            }}
          />
        )}
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
  addChild: PropTypes.func,
  updateContent: PropTypes.func,
  itemOptions: PropTypes.objectOf(PropTypes.any),
  onChangeOption: PropTypes.func,
  selectedItemId: PropTypes.string,
  setEditing: PropTypes.func,
  onChangeGlobalProperties: PropTypes.func,
  topicProperties: PropTypes.objectOf(PropTypes.any),
  chapterProperties: PropTypes.objectOf(PropTypes.any),
  pageProperties: PropTypes.objectOf(PropTypes.any),
  item: PropTypes.objectOf(PropTypes.any),
  childSelectedList: PropTypes.arrayOf(PropTypes.any),
  onChangeValue: PropTypes.func,
};

export default withRouter(withTranslation()(PageController));
