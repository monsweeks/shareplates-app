import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, ExitButton, Popup } from '@/components';
import './ScreenTypeSelector.scss';
import { SCREEN_TYPE } from '@/constants/constants';

class ScreenTypeSelector extends React.PureComponent {
  render() {
    const { className, t, onSelect, exitShare } = this.props;

    return (
      <Popup open full className="screen-type-selector-popup">
        <div className={`screen-type-selector-wrapper g-no-select ${className}`}>
          <ExitButton
            className="close-button"
            size="20px"
            onClick={() => {
              exitShare();
            }}
          />
          <div>
            <h1>{t('이 브라우저의 역할을 선택해주세요')}</h1>
            <p>{t('현재 접속한 브라우저가 동작하는 방식을 선택할 수 있습니다.')}</p>
            <div className="buttons">
              <div>
                <Button
                  color="transparent"
                  onClick={() => {
                    onSelect(SCREEN_TYPE.WEB);
                  }}
                >
                  <div className="icon">
                    <span>
                      <i className="fal fa-browser" />
                    </span>
                  </div>
                  <div className="text">{t('웹 페이지')}</div>
                </Button>
                <div className="desc">{t('매니저 권한을 가진 웹 페이지로 동작합니다.')}</div>
              </div>
              <div className="separator">
                <div />
              </div>
              <div>
                <Button
                  color="transparent"
                  onClick={() => {
                    onSelect(SCREEN_TYPE.PROJECTOR);
                  }}
                >
                  <div className="icon">
                    <span>
                      <i className="fal fa-projector" />
                    </span>
                  </div>
                  <div className="text">{t('프로젝터')}</div>
                </Button>
                <div className="desc">{t('프로젝터에 적합한 레이아웃과 기능으로 컨텐츠가 나타납니다.')}</div>
              </div>
              <div className="separator">
                <div />
              </div>
              <div>
                <Button
                  color="transparent"
                  onClick={() => {
                    onSelect(SCREEN_TYPE.CONTROLLER);
                  }}
                >
                  <div className="icon">
                    <span>
                      <i className="fal fa-gamepad-alt" />
                    </span>
                  </div>
                  <div className="text">{t('')}컨트롤러</div>
                </Button>
                <div className="desc">
                  {t('진행을 위한 컨트롤러 기능과, 다양한 공유 관련 정보를 확인할 수 있습니다.')}
                </div>
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
  exitShare: PropTypes.func,
};

export default withRouter(withTranslation()(ScreenTypeSelector));
