import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import ReactTooltip from 'react-tooltip';
import ColorControl from '@/assets/Topics/PageEditor/PageController/ColorControl/ColorControl';
import PaddingControl from '@/assets/Topics/PageEditor/PageController/PaddingControl/PaddingControl';
import { Selector } from '@/components';
import './FormLevelProperties.scss';

class FormLevelProperties extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { t, fontFamilies, fontSizes, onChangeProperties, properties } = this.props;

    return (
      <div className="form-level-properties-wrapper">
        <div>
          <div className="label">{t('폰트 종류')}</div>
          <div className="control">
            <Selector
              outline
              items={fontFamilies.map((item) => {
                return {
                  key: item.value,
                  value: item.name,
                };
              })}
              value={properties.fontFamily}
              onChange={(value) => {
                onChangeProperties('fontFamily', value);
              }}
              minWidth="140px"
            />
          </div>
        </div>
        <div>
          <div className="label">폰트 크기</div>
          <div className="control">
            <Selector
              outline
              items={fontSizes.map((item) => {
                return {
                  key: item.value,
                  value: item.name,
                };
              })}
              value={properties.fontSize}
              onChange={(value) => {
                onChangeProperties('fontSize', value);
              }}
              minWidth="140px"
            />
          </div>
        </div>
        <div className='color-row'>
          <div className="label">폰트 색상</div>
          <div className="control">
            <ColorControl
              className="form-level-color-picker"
              colorPickerWidth="257px"
              colorPickerHeight="200px"
              optionKey="color"
              active
              value={properties.color}
              onSelect={onChangeProperties}
              disableChildrenClickEvent
            >
              <span
                className="color-border"
                style={{
                  color: properties.color,
                }}
              >
                가
              </span>
            </ColorControl>
          </div>
        </div>
        <div className='color-row'>
          <div className="label">배경 색상</div>
          <div className="control">
            <ColorControl
              className="form-level-color-picker"
              colorPickerWidth="257px"
              colorPickerHeight="200px"
              optionKey="backgroundColor"
              active
              value={properties.backgroundColor}
              onSelect={onChangeProperties}
              disableChildrenClickEvent
            >
              <span
                className="color-border fill-color"
                style={{
                  backgroundColor: properties.backgroundColor,
                }}
              />
            </ColorControl>
          </div>
        </div>
        <div className='color-row'>
          <div className="label">페이지 여백</div>
          <div className="control">
            <PaddingControl
              className="form-level-padding"
              optionKey="padding"
              active
              value={properties.padding}
              onApply={onChangeProperties}
            />
          </div>
        </div>
      </div>
    );
  }
}

FormLevelProperties.propTypes = {
  t: PropTypes.func,
  fontSizes: PropTypes.arrayOf(PropTypes.any),
  fontFamilies: PropTypes.arrayOf(PropTypes.any),
  onChangeProperties: PropTypes.func,
  properties: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(withTranslation()(FormLevelProperties));
