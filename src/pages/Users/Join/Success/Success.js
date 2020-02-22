import React from 'react';
import { withRouter } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { addMessage } from 'actions';
import { FullLayout } from '@/layouts';
import { Button, Card, CardBody, CardHeader, Col, Container, Link, Logo, Row } from '@/components';
import naver from '@/images/sites/naver.png';
import google from '@/images/sites/google.png';
import daum from '@/images/sites/daum.png';
import './Success.scss';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const mailServers = [
  {
    postfix: '@naver.com',
    url: 'http://mail.naver.com',
    name: 'naver',
    img: naver,
  },
  {
    postfix: '@daum.net',
    url: 'http://mail.daum.net/',
    name: 'daum',
    img: daum,
  },
  {
    postfix: '@gmail.com',
    url: 'https://mail.google.com',
    name: 'naver',
    imag: google,
  },
];

class Success extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  getMailServerInfo = (email) => {
    const { t } = this.props;

    const mailServer = mailServers.find((d) => {
      return email && email.indexOf(d.postfix) > -1;
    });

    if (mailServer) {
      return (
        <Button
          color={mailServer.name}
          className="mail-link-button g-image-button ml-1"
          onClick={() => {
            window.open(mailServer.url);
          }}
          data-tip={t('label.moveToEmailSite')}
        >
          <div>
            <img src={mailServer.img} alt="NAVER" />
          </div>
          <div className="mail-icon">
            <i className="fal fa-envelope" />
          </div>
        </Button>
      );
    }

    return null;
  };

  render() {
    const { t, join } = this.props;
    const { addMessage: addMessageReducer } = this.props;
    const mailLinkButton = this.getMailServerInfo(join.email);

    return (
      <FullLayout className="join-success-wrapper">
        <div className="summary">
          <Container>
            <Row>
              <Col lg={4} className="align-self-center mb-4 mb-lg-0">
                <h1 className="text-white text-center m-0">{t('환영합니다')}</h1>
              </Col>
              <Col lg={8} className="text-center">
                <div className="success-logo">
                  <Logo hideText />
                </div>
                <Card className="border-0 rounded-sm">
                  <CardBody>
                    <div className="mb-4 text-justify">{t('message.confirmEmail')}</div>
                    <Row className="mb-4">
                      <Col lg={mailLinkButton ? 9 : 12}>
                        <Button
                          color="primary"
                          onClick={() => {
                            addMessageReducer(
                              0,
                              MESSAGE_CATEGORY.INFO,
                              t('message.waitPlease'),
                              t('message.notImplement'),
                            );
                          }}
                        >
                          {t('button.resendEmail')}
                        </Button>
                      </Col>
                      {mailLinkButton && (
                        <Col className="position-relative mt-4 mt-lg-0" lg={3}>
                          {mailLinkButton}
                          <div className="d-none d-lg-inline-block separator" />
                        </Col>
                      )}
                    </Row>
                    <div className="text-right small">
                      <Link
                        color="blue"
                        to="/users/login"
                        onClick={(e) => {
                          e.preventDefault();
                          addMessageReducer(
                            0,
                            MESSAGE_CATEGORY.INFO,
                            t('message.waitPlease'),
                            t('message.notImplement'),
                          );
                        }}
                      >
                        {t('message.cannotEmailReceived')}
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="detail py-3 py-sm-4">
          <Container>
            <Row>
              <Col lg={6} className="mb-3 mb-sm-4">
                <Card className="border-0">
                  <CardHeader className="bg-secondary border-0">
                    <div className="g-category-label mb-0 text-white">
                      <i className="fal fa-chevron-circle-right" /> {t('label.makeTopic')}
                    </div>
                  </CardHeader>
                  <CardBody className="bg-gray-300 py-4">
                    <p className="text-center">{t('message.letsMakeTopic')}</p>
                    <div className="text-center">
                      <Button
                        color="primary"
                        className="link-button g-icon-text-button"
                        onClick={() => {
                          addMessageReducer(
                            0,
                            MESSAGE_CATEGORY.INFO,
                            t('message.waitPlease'),
                            t('message.notImplement'),
                          );
                        }}
                      >
                        <div>
                          <span>
                            <i className="fal fa-plus" />
                          </span>
                          <span>{t('label.makeTopic')}</span>
                        </div>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6} className="mb-3 mb-sm-4">
                <Card className="border-0">
                  <CardHeader className="bg-secondary border-0">
                    <div className="g-category-label mb-0 text-white">
                      <i className="fal fa-chevron-circle-right" /> {t('label.videoTutorial')}
                    </div>
                  </CardHeader>
                  <CardBody className="bg-gray-300 py-4">
                    <p className="text-center">
                      <Trans i18nKey="message.letsShowVideoTutorial">
                        영상을 통해
                        <span className="g-shareplates">{{ text: 'SHAREPLATES' }}</span>의 소개와 사용법 그리고 다양한
                        활용 방법을 확인해보세요
                      </Trans>
                    </p>
                    <div className="text-center">
                      <Button
                        color="primary"
                        className="link-button g-icon-text-button"
                        onClick={() => {
                          addMessageReducer(
                            0,
                            MESSAGE_CATEGORY.INFO,
                            t('message.waitPlease'),
                            t('message.notImplement'),
                          );
                        }}
                      >
                        <div>
                          <span>
                            <i className="fal fa-tv-retro" />
                          </span>
                          <span>{t('label.videoTutorial')}</span>
                        </div>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Card className="border-0">
                  <CardHeader className="bg-secondary border-0">
                    <div className="g-category-label mb-0 text-white">
                      <i className="fal fa-chevron-circle-right" /> {t('label.userConfig')}
                    </div>
                  </CardHeader>
                  <CardBody className="bg-gray-300 py-4">
                    <p className="text-center">{t('message.letsConfirmYourInfo')}</p>
                    <div className="text-center">
                      <Button
                        color="primary"
                        className="link-button g-icon-text-button"
                        onClick={() => {
                          addMessageReducer(
                            0,
                            MESSAGE_CATEGORY.INFO,
                            t('message.waitPlease'),
                            t('message.notImplement'),
                          );
                        }}
                      >
                        <div>
                          <span>
                            <i className="fal fa-robot" />
                          </span>
                          <span>{t('label.confirmMyInfo')}</span>
                        </div>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </FullLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
  };
};

const mapStateToProps = (state) => {
  return {
    join: state.user.join,
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Success)));

Success.defaultProps = {
  t: null,
};

Success.propTypes = {
  t: PropTypes.func,
  join: PropTypes.objectOf({
    email: PropTypes.string,
  }),
  addMessage: PropTypes.func,
};
