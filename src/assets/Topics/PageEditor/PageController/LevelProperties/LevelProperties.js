import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import Separator from '@/assets/Topics/PageEditor/PageController/Separator/Separator';
import SelectControl from '@/assets/Topics/PageEditor/PageController/SelectControl/SelectControl';
import ColorControl from '@/assets/Topics/PageEditor/PageController/ColorControl/ColorControl';
import PaddingControl from '@/assets/Topics/PageEditor/PageController/PaddingControl/PaddingControl';

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
    const { t, level, fontFamilies, fontSizes, onChangeProperties, properties, active } = this.props;

    return (
      <>
        <SelectControl
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
        <SelectControl
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
        <Separator />
        <ColorControl
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
        <Separator />
        <ColorControl
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
        <Separator />
        <PaddingControl
          dataTip={`${level} ${t('내부 간격')}`}
          optionKey="padding"
          active={active}
          value={properties.padding}
          onApply={onChangeProperties}
        />
      </>
    );
  }
}

LevelProperties.propTypes = {
  t: PropTypes.func,
  level: PropTypes.string,
  fontSizes : PropTypes.arrayOf(PropTypes.any),
  fontFamilies: PropTypes.arrayOf(PropTypes.any),
  onChangeProperties: PropTypes.func,
  properties: PropTypes.objectOf(PropTypes.any),
  active: PropTypes.bool,
};

export default withRouter(withTranslation()(LevelProperties));
