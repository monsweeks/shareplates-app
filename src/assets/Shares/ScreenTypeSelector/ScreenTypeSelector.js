import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, Popup } from '@/components';
import './ScreenTypeSelector.scss';
import { SCREEN_TYPE } from '@/constants/constants';

class ScreenTypeSelector extends React.PureComponent {
  render() {
    const { className, t, onSelect } = this.props;

    return (
      <Popup open>
        <div className={`screen-type-selector-wrapper g-no-select ${className}`}>
          <div className="mb-3">
            <span className="intro-msg bg-yellow py-2 px-3 rounded-sm">{t('이 브라우저의 역할을 선택해주세요')}</span>
          </div>
          <div className="buttons">
            <div>
              <Button
                className="w-100 h-100"
                color="primary"
                onClick={() => {
                  onSelect(SCREEN_TYPE.WEB);
                }}
              >
                <div className="icon">
                  <i className="fad fa-browser" />
                </div>
                <div className="text">{t('웹 페이지')}</div>
              </Button>
              <div className="line web">
                <div className="ball" />
              </div>
              <div className="desc">{t('매니저 권한을 가진 웹 페이지로 동작합니다.')}</div>
            </div>
            <div>
              <Button
                className="w-100 h-100"
                color="primary"
                onClick={() => {
                  onSelect(SCREEN_TYPE.PROJECTOR);
                }}
              >
                <div className="icon">
                  <i className="fad fa-projector" />
                </div>
                <div className="text">{t('프로젝터')}</div>
              </Button>
              <div className="line projector">
                <div className="ball" />
              </div>
              <div className="desc">{t('프로젝터에 적합한 레이아웃과 기능으로 컨텐츠가 나타납니다.')}</div>
            </div>
            <div>
              <Button
                className="w-100 h-100"
                color="primary"
                onClick={() => {
                  onSelect(SCREEN_TYPE.CONTROLLER);
                }}
              >
                <div className="icon">
                  <i className="fad fa-gamepad-alt" />
                </div>
                <div className="text">{t('')}컨트롤러</div>
              </Button>
              <div className="line controller">
                <div className="ball" />
              </div>
              <div className="desc">
                {t('진행을 위한 컨트롤러 기능과, 다양한 공유 관련 정보를 확인할 수 있습니다.')}
              </div>
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

ScreenTypeSelector.defaultProps = {
  className: '',
};

ScreenTypeSelector.propTypes = {
  className: PropTypes.string,
  t: PropTypes.func,
  onSelect: PropTypes.func,
};

export default withRouter(withTranslation()(ScreenTypeSelector));
