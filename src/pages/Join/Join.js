import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { RegisterLayout } from '@/layouts';
import { Form, Input, FormGroup, Button, Row, Col, Link } from '@/components';
import request from '../../utils/request';
import facebook from '@/images/sites/facebook.png';
import naver from '@/images/sites/naver.png';
import kakao from '@/images/sites/kakao.png';
import google from '@/images/sites/google.png';
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
    };
  }

  onChange = (field) => (value) => {
    const { user } = this.state;
    this.setState({
      user: user.set(field, value),
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { user } = this.state;
    request.post('/api/users', user.toJS(), (data) => {
      // eslint-disable-next-line no-console
      console.log(data);
    });
  };

  onSocialLogin = (social) => {
    console.log(social);
  };

  render() {
    const { t } = this.props;
    const { user } = this.state;

    return (
      <RegisterLayout className="join-wrapper align-self-center w-100">
        <h1 className="text-center">{t('label.memberJoin')}</h1>
        <p className="text-center d-md-block">
          <Link color="blue" to="/login">
            {t('message.moveToLoginPage')}
          </Link>
        </p>
        <Row>
          <Col>
            <Form onSubmit={this.onSubmit} className="px-2 px-sm-0">
              <FormGroup>
                <Input
                  type="email"
                  label={t('label.email')}
                  placeholderMessage={t('message.pleaseTypeEmailAddress')}
                  value={user.get('email')}
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('email')}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  label={t('label.name')}
                  placeholderMessage={t('message.pleaseTypeNameOrAlias')}
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
                      <img src={kakao} alt="KAKAO" />
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
                      <img src={naver} alt="NAVER" />
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
                      <img src={google} alt="GOOGLE" />
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
                      <img src={facebook} alt="FACEBOOK" />
                    </div>
                  </Button>
                </div>
              </FormGroup>
            </Form>
          </Col>
          <Col className="text-center align-self-center d-none d-lg-block">
            <FormGroup className="mb-2 mb-lg-3">
              <Button color="facebook" className="g-image-text-button mb-2 mb-lg-0 ml-3">
                <div>
                  <span>
                    <img src={facebook} alt="FACEBOOK" />
                  </span>
                  <span>{t('label.facebookLogin')}</span>
                </div>
              </Button>
              <Button color="google" className="g-image-text-button ml-3">
                <div>
                  <span>
                    <img src={google} alt="GOOGLE" />
                  </span>
                  <span>{t('label.googleLogin')}</span>
                </div>
              </Button>
            </FormGroup>
            <FormGroup>
              <Button color="naver" className="mb-2 mb-lg-0 g-image-text-button ml-3">
                <div>
                  <span>
                    <img src={naver} alt="NAVER" />
                  </span>
                  <span>{t('label.naverLogin')}</span>
                </div>
              </Button>
              <Button color="kakao" className="g-image-text-button ml-3">
                <div>
                  <span>
                    <img src={kakao} alt="KAKAO" />
                  </span>
                  <span>{t('label.kakaoLogin')}</span>
                </div>
              </Button>
            </FormGroup>
          </Col>
        </Row>
        <p className="text-center px-2 px-sm-0">
          <Trans i18nKey="message.joinNoticeInfo">
            가입 시 <Link color="blue" to="/login">{{terms : t('label.terms')}}</Link>에 동의하고, <Link color="blue" to="/login">{{policy : t('label.privacyPolicy')}}</Link>을 숙지하였음을 인정합니다.
          </Trans>
        </p>
      </RegisterLayout>
    );
  }
}

export default withRouter(withTranslation()(Join));

Join.defaultProps = {
  t: null,
};

Join.propTypes = {
  t: PropTypes.func,
};
