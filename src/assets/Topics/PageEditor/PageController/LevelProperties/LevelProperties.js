import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import SelectControl from '@/assets/Topics/PageEditor/PageController/SelectControl/SelectControl';
import ColorControl from '@/assets/Topics/PageEditor/PageController/ColorControl/ColorControl';
import PaddingControl from '@/assets/Topics/PageEditor/PageController/PaddingControl/PaddingControl';
import './LevelProperties.scss';
import { Button, EmptyMessage } from '@/components';

class LevelProperties extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

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
    const {
      className,
      rightBorder,
      t,
      level,
      fontFamilies,
      fontSizes,
      onChangeProperties,
      properties,
      active,
      readOnly,
      onSetDefault,
      empty,
    } = this.props;

    return (
      <div className={`level-properties-wrapper ${className} ${rightBorder ? 'right-border' : ''}`}>
        {empty && (
          <>
            <div className="level-title">
              <div className="left-line">
                <div />
                <div className="rect" />
              </div>
              <div className="title">
                {level} {t('속성')}
              </div>
              <div className="right-line">
                <div />
              </div>
            </div>
            <div className="level-content empty">
              <EmptyMessage
                className="h6 bg-white"
                message={
                  <div>
                    <div className="h4">
                      <i className="fal fa-exclamation-circle" />
                    </div>
                    <div>{t('페이지가 선택되지 않았습니다')}</div>
                  </div>
                }
              />
            </div>
          </>
        )}
        {!empty && (
          <>
            <div className="level-title">
              <div className="left-line">
                <div />
                <div className="rect" />
              </div>
              <div className="title">
                {level} {t('속성')}
              </div>
              <div className="right-line">
                <div />
              </div>
            </div>
            <div className="level-content">
              <div className="level-row">
                <div className="level-label">{t('폰트')}</div>
                <div className="level-control">
                  {readOnly && (
                    <div className="text-value">
                      {this.getFontFamilyName(fontFamilies, properties.fontFamily)}&nbsp;
                    </div>
                  )}
                  {!readOnly && (
                    <SelectControl
                      block
                      dataTip={`${level} ${t('폰트')}`}
                      minWidth="120px"
                      height="140px"
                      optionKey="fontFamily"
                      list={fontFamilies}
                      active={!!active}
                      value={properties.fontFamily}
                      onSelect={onChangeProperties}
                    >
                      <span>{this.getFontFamilyName(fontFamilies, properties.fontFamily)}</span>
                    </SelectControl>
                  )}
                </div>
              </div>
              <div className="level-row">
                <div className="level-label">{t('폰트 크기')}</div>
                <div className="level-control">
                  {readOnly && (
                    <div className="text-value">{this.getFontSizeName(fontSizes, properties.fontSize)}&nbsp;</div>
                  )}
                  {!readOnly && (
                    <SelectControl
                      block
                      dataTip={`${level} ${t('기본 폰트 크기')}`}
                      minWidth="64px"
                      height="140px"
                      optionKey="fontSize"
                      list={fontSizes}
                      active={active}
                      value={properties.fontSize}
                      onSelect={onChangeProperties}
                    >
                      <span>{this.getFontSizeName(fontSizes, properties.fontSize)}</span>
                    </SelectControl>
                  )}
                </div>
              </div>
              <div className="level-row">
                <div className="level-label">{t('폰트 색상')}</div>
                <div className="level-control">
                  {readOnly && (
                    <div className="color-value text-uppercase">
                      {properties.color}
                      <span
                        className="color-bar"
                        style={{
                          backgroundColor: properties.color,
                        }}
                      />
                    </div>
                  )}
                  {!readOnly && (
                    <ColorControl
                      outline
                      disableChildrenClickEvent
                      block
                      dataTip={`${level} ${t('기본 폰트 색상')}`}
                      colorPickerWidth="257px"
                      colorPickerHeight="200px"
                      optionKey="color"
                      active={active}
                      value={properties.color}
                      onSelect={onChangeProperties}
                    >
                      <span className="color-border">
                        가
                        <span
                          className="color-bar"
                          style={{
                            backgroundColor: properties.color,
                          }}
                        />
                      </span>
                    </ColorControl>
                  )}
                </div>
              </div>
              <div className="level-row">
                <div className="level-label">{t('배경 색상')}</div>
                <div className="level-control">
                  {readOnly && (
                    <div className="color-value text-uppercase">
                      {properties.backgroundColor}
                      <span
                        className="color-bar"
                        style={{
                          backgroundColor: properties.backgroundColor,
                        }}
                      />
                    </div>
                  )}
                  {!readOnly && (
                    <ColorControl
                      outline
                      disableChildrenClickEvent
                      block
                      dataTip={`${level} ${t('배경 색상')}`}
                      colorPickerWidth="257px"
                      colorPickerHeight="200px"
                      optionKey="backgroundColor"
                      active={active}
                      value={properties.backgroundColor}
                      onSelect={onChangeProperties}
                    >
                      <span className="color-border fill-color">
                        <i className="fal fa-fill" />
                        <span
                          className="color-bar"
                          style={{
                            backgroundColor: properties.backgroundColor,
                          }}
                        />
                      </span>
                    </ColorControl>
                  )}
                </div>
              </div>
              <div className="level-row">
                <div className="level-label">{t('페이지 여백')}</div>
                <div className="level-control">
                  {readOnly && <div className="text-value">{properties.padding}&nbsp;</div>}
                  {!readOnly && (
                    <PaddingControl
                      dataTip={`${level} ${t('내부 간격')}`}
                      optionKey="padding"
                      outline
                      block
                      active={active}
                      value={properties.padding}
                      onApply={onChangeProperties}
                    />
                  )}
                </div>
              </div>
              <div className="clear-button text-center py-2">
                {!readOnly && (
                  <Button color="primary" size="sm" onClick={onSetDefault}>
                    초기화
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

LevelProperties.defaultProps = {
  empty: false,
};

LevelProperties.propTypes = {
  className: PropTypes.string,
  t: PropTypes.func,
  level: PropTypes.string,
  fontSizes: PropTypes.arrayOf(PropTypes.any),
  fontFamilies: PropTypes.arrayOf(PropTypes.any),
  onChangeProperties: PropTypes.func,
  properties: PropTypes.objectOf(PropTypes.any),
  active: PropTypes.bool,
  rightBorder: PropTypes.bool,
  readOnly: PropTypes.bool,
  onSetDefault: PropTypes.func,
  empty: PropTypes.bool,
};

export default withRouter(withTranslation()(LevelProperties));
