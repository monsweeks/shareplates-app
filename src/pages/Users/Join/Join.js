import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { addMessage, setJoinEmail } from 'actions';
import { Button, Col, Form, FormGroup, Input, Link, Row } from '@/components';
import request from '@/utils/request';
import siteImage from '@/images/sites';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { CenterBoxLayout } from '@/layouts';
import './Join.scss';

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: Map({
        email: '',
        name: '',
        password: '',
        passwordConfirm: '',
      }),
      existEmail: false,
    };

    this.checkEmailExistDebounced = debounce(this.checkEmailExist, 400);
  }

  componentWillUnmount() {
    this.checkEmailExistDebounced.cancel();
  }

  checkEmailExist = (email) => {
    request.get(
      '/api/users/exists',
      { email },
      (data) => {
        this.setState({
          existEmail: data,
        });
      },
      null,
      true,
    );
  };

  onChange = (field) => (value) => {
    const { user } = this.state;

    if (field === 'email') {
      this.checkEmailExistDebounced(value);
    }
    this.setState({
      user: user.set(field, value),
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { user } = this.state;
    const { t, history, addMessage: addMessageReducer } = this.props;

    if (user.get('passwordConfirm') !== user.get('password')) {
      addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('validation.badInput'), t('validation.notEqualPassword'));
      return;
    }

    request.post('/api/users', user.toJS(), (data) => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.setJoinEmail(data.email);
      history.push('/users/join/success');
    });
  };

  onSocialLogin = () => {
    const { t, addMessage: addMessageReducer } = this.props;
    addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('message.waitPlease'), t('message.notImplement'));
  };

  render() {
    const { t, addMessage: addMessageReducer } = this.props;
    const { user, existEmail } = this.state;

    return (
      <CenterBoxLayout className="join-wrapper">
        <h1 className="text-center">JOIN</h1>
        <p className="text-center d-md-block mb-0">
          <Link color="blue" to="/users/login">
            {t('message.moveToLoginPage')}
          </Link>
        </p>
        <Row className="mb-0 mb-sm-4">
          <Col>
            <Form onSubmit={this.onSubmit} className="px-2 px-sm-0">
              <FormGroup>
                <Input
                  type="email"
                  label={t('label.email')}
                  value={user.get('email')}
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('email')}
                  customInputValidationMessage={{
                    typeMismatch: 'validation.invalidEmail',
                  }}
                  externalValidationMessage={existEmail ? t('validation.alreadyJoinedEmail') : undefined}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  label={t('label.name')}
                  value={user.get('name')}
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('name')}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  label={t('label.password')}
                  value={user.get('password')}
                  type="password"
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('password')}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  label={t('label.passwordConfirm')}
                  value={user.get('passwordConfirm')}
                  type="password"
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('passwordConfirm')}
                />
              </FormGroup>
              <FormGroup className="text-center">
                <Button className="px-4" color="primary">
                  {t('label.join')}
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
                      <img src={siteImage.kakao} alt="KAKAO" />
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
                      <img src={siteImage.naver} alt="NAVER" />
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
                      <img src={siteImage.google} alt="GOOGLE" />
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
                      <img src={siteImage.facebook} alt="FACEBOOK" />
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
                  addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('message.waitPlease'), t('message.notImplement'));
                }}
              >
                <div>
                  <span>
                    <img src={siteImage.facebook} alt="FACEBOOK" />
                  </span>
                  <span>{t('label.facebookLogin')}</span>
                </div>
              </Button>
              <Button
                color="google"
                className="g-image-text-button ml-3"
                onClick={() => {
                  addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('message.waitPlease'), t('message.notImplement'));
                }}
              >
                <div>
                  <span>
                    <img src={siteImage.google} alt="GOOGLE" />
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
                  addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('message.waitPlease'), t('message.notImplement'));
                }}
              >
                <div>
                  <span>
                    <img src={siteImage.naver} alt="NAVER" />
                  </span>
                  <span>{t('label.naverLogin')}</span>
                </div>
              </Button>
              <Button
                color="kakao"
                className="g-image-text-button ml-3"
                onClick={() => {
                  addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('message.waitPlease'), t('message.notImplement'));
                }}
              >
                <div>
                  <span>
                    <img src={siteImage.kakao} alt="KAKAO" />
                  </span>
                  <span>{t('label.kakaoLogin')}</span>
                </div>
              </Button>
            </FormGroup>
          </Col>
        </Row>
        <p className="text-justify text-sm-center px-0 px-sm-0 mb-0">
          <Trans i18nKey="message.joinNoticeInfo">
            가입 시
            <Link target="_blank" color="blue" to="/about/terms-and-conditions">
              {{ terms: t('label.terms') }}
            </Link>
            에 동의하고,
            <Link target="_blank" color="blue" to="/about/privacy-policy">
              {{ policy: t('label.privacyPolicy') }}
            </Link>
            을 숙지하였음을 인정합니다.
          </Trans>
        </p>
      </CenterBoxLayout>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setJoinEmail: (email) => dispatch(setJoinEmail(email)),
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(Join)));

Join.defaultProps = {
  t: null,
};

Join.propTypes = {
  t: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  setJoinEmail: PropTypes.func,
  addMessage: PropTypes.func,
};
