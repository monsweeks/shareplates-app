import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import qs from 'qs';
import { connect } from 'react-redux';
import Kakao from '@/vendor/kakao.min.js';
import { Button, CheckBoxInput, Col, Form, FormGroup, Input, Link, Row } from '@/components';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import siteImage from '@/images/sites';
import request from '@/utils/request';
import storage from '@/utils/storage';
import { addMessage, setUserInfo } from '@/actions';
import { CenterBoxLayout } from '@/layouts';
import socialLogin from '../util';
import './Login.scss';

class Login extends React.PureComponent {
  constructor(props) {
    super(props);

    const email = storage.getItem('login', 'email');

    if (!Kakao.isInitialized()) Kakao.init('863525fbdd02a15ac03536bbfcf0151d');

    this.state = {
      email: email || '',
      password: '',
      saveEmail: !!email,
      loginResult: null,
      url: null,
    };
  }

  componentDidMount() {
    const {
      location: { search },
    } = this.props;

    const params = qs.parse(search, { ignoreQueryPrefix: true });

    if (params.url) {
      this.setState({
        url: params.url,
      });
    }
  }

  onChange = (field) => (value) => {
    const { loginResult } = this.state;
    const obj = {};
    obj[field] = value;

    if (loginResult !== null && loginResult === false) {
      obj.loginResult = null;
    }

    if (field === 'saveEmail' && !value) {
      storage.setItem('login', 'email', null);
    }

    this.setState(obj);
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { email, password, saveEmail, url } = this.state;
    const { history, setUserInfo: setUserInfoReducer } = this.props;

    if (saveEmail) {
      storage.setItem('login', 'email', email);
    } else {
      storage.setItem('login', 'email', null);
    }

    request.post(
      '/api/users/login',
      {
        email,
        password,
      },
      (success) => {
        if (success) {
          request.get('/api/users/my-info', null, (data) => {
            setUserInfoReducer(data.user || {}, data.grps);
            if (url) {
              history.push(url);
            } else {
              history.push('/');
            }
          });
        } else {
          this.setState({
            loginResult: false,
          });
        }
      },
    );
  };

  onSocialLogin = (vendor) => {
    const { t, addMessage: addMessageReducer } = this.props;
    socialLogin(vendor, () => {
      addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('message.waitPlease'), t('message.notImplement'));
    });
  };

  render() {
    const { t } = this.props;
    const { email, password, saveEmail, loginResult, url } = this.state;

    return (
      <CenterBoxLayout className="login-wrapper">
        <h1 className="text-center">LOGIN</h1>
        <p className="text-center d-md-block mb-0">
          <Link color="blue" to="/users/join">
            {t('message.moveToJoinPage')}
          </Link>
        </p>
        {url && (
          <p className="need-login-message">
            <span>{t('로그인이 필요한 URL입니다')}</span>
          </p>
        )}
        <Row>
          <Col>
            <p className="text-danger text-center mb-1">
              {loginResult !== null && loginResult === false && <span>{t('message.invalidIdorPassword')}</span>}
              &nbsp;
            </p>
            <Form onSubmit={this.onSubmit} className="px-2 px-sm-0">
              <FormGroup>
                <Input
                  type="email"
                  label={t('label.email')}
                  value={email}
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('email')}
                  customInputValidationMessage={{
                    typeMismatch: 'validation.invalidEmail',
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  label={t('label.password')}
                  value={password}
                  type="password"
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('password')}
                />
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col>
                    <CheckBoxInput
                      size="sm"
                      type="checkbox"
                      value={saveEmail}
                      onChange={this.onChange('saveEmail')}
                      label={t('label.rememberEmail')}
                    />
                  </Col>
                  <Col className="text-right">
                    <Link className="find-user-account" color="blue" to="/users/recovery">
                      {t('label.findAccountInfo')}
                    </Link>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup className="text-center mt-5">
                <Button className="px-4" color="primary">
                  {t('label.login')}
                </Button>
                <div className="mobile-social-buttons d-block d-sm-inline-block d-lg-none ">
                  <Button
                    color="kakao"
                    className="g-image-button ml-1"
                    onClick={() => {
                      this.onSocialLogin('kakao');
                    }}
                  >
                    <div>
                      <img src={siteImage.kakao} alt="kakao" />
                    </div>
                  </Button>
                  <Button
                    color="naver"
                    className="g-image-button ml-1"
                    onClick={() => {
                      this.onSocialLogin('naver');
                    }}
                  >
                    <div>
                      <img src={siteImage.naver} alt="naver" />
                    </div>
                  </Button>
                  <Button
                    color="google"
                    className="g-image-button ml-1"
                    onClick={() => {
                      this.onSocialLogin('google');
                    }}
                  >
                    <div>
                      <img src={siteImage.google} alt="google'" />
                    </div>
                  </Button>
                  <Button
                    color="facebook"
                    className="g-image-button ml-1"
                    onClick={() => {
                      this.onSocialLogin('facebook');
                    }}
                  >
                    <div>
                      <img src={siteImage.facebook} alt="facebook" />
                    </div>
                  </Button>
                </div>
              </FormGroup>
            </Form>
          </Col>
          <Col className="text-center align-self-center d-none d-lg-block">
            <FormGroup className="mb-2 mb-lg-3">
              <Button
                color="facebook"
                className="g-image-text-button mb-2 mb-lg-0 ml-3"
                onClick={() => {
                  this.onSocialLogin('facebook');
                }}
              >
                <div>
                  <span>
                    <img src={siteImage.facebook} alt="facebook" />
                  </span>
                  <span>{t('label.facebookLogin')}</span>
                </div>
              </Button>
              <Button
                color="google"
                className="g-image-text-button ml-3"
                onClick={() => {
                  this.onSocialLogin('google');
                }}
              >
                <div>
                  <span>
                    <img src={siteImage.google} alt="google" />
                  </span>
                  <span>{t('label.googleLogin')}</span>
                </div>
              </Button>
            </FormGroup>
            <FormGroup>
              <Button
                color="naver"
                className="mb-2 mb-lg-0 g-image-text-button ml-3"
                onClick={() => {
                  this.onSocialLogin('naver');
                }}
              >
                <div>
                  <span>
                    <img src={siteImage.naver} alt="naver" />
                  </span>
                  <span>{t('label.naverLogin')}</span>
                </div>
              </Button>
              <Button
                color="kakao"
                className="g-image-text-button ml-3"
                onClick={() => {
                  this.onSocialLogin('kakao');
                }}
              >
                <div>
                  <span>
                    <img src={siteImage.kakao} alt="kakao" />
                  </span>
                  <span>{t('label.kakaoLogin')}</span>
                </div>
              </Button>
            </FormGroup>
          </Col>
        </Row>
      </CenterBoxLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUserInfo: (user, grps) => dispatch(setUserInfo(user, grps)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(Login)));

Login.propTypes = {
  t: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};
