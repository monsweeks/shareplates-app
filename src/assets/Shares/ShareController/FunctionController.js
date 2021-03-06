import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, Card, CardBody } from '@/components';
import './FunctionController.scss';

class FunctionController extends React.PureComponent {
  render() {
    const { className, t, setOption } = this.props;

    return (
      <div className={`${className} function-controller-wrapper`}>
        <div className="flex-grow-1 position-relative">
          <div className="g-attach-parent d-flex flex-column">
            <Card className="border-0 flex-grow-0 m-4">
              <CardBody className="p-0">
                <div className="message mb-3">
                  <i className="fal fa-exclamation-circle" /> 프로젝터 옵션 관리
                </div>
                <div className="line px-3 py-0 mb-2">
                  <div className="label">{t('상단 메뉴')}</div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="value text-right">
                    <Button
                      className="mr-2"
                      size="sm"
                      color="primary"
                      onClick={() => {
                        setOption('hideShareNavigator', true);
                      }}
                    >
                      숨김
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => {
                        setOption('hideShareNavigator', false);
                      }}
                    >
                      보임
                    </Button>
                  </div>
                </div>
                <div className="line px-3 mb-2">
                  <div className="label">{t('풀스크린')}</div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="value text-right">
                    <Button
                      className="mr-2"
                      size="sm"
                      color="primary"
                      onClick={() => {
                        setOption('fullScreen', false);
                      }}
                    >
                      윈도우 화면
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => {
                        setOption('fullScreen', true);
                      }}
                    >
                      전체 화면
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="border-0 flex-grow-1">
              <CardBody />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

FunctionController.defaultProps = {
  className: '',
};

FunctionController.propTypes = {
  className: PropTypes.string,
  t: PropTypes.func,
  setOption: PropTypes.func,
};

export default withTranslation()(FunctionController);
