import React, { Component } from 'react';
import './Join.scss';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { RegisterLayout } from '@/layouts';
import { Form, Input, FormGroup, Button, Row, Col, Link } from '@/components';
import request from '../../utils/request';
import facebook from '@/images/sites/facebook.png';
import naver from '@/images/sites/naver.png';
import kakao from '@/images/sites/kakao.png';
import google from '@/images/sites/google.png';

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
        <h1 className="text-center">회원가입</h1>
        <p className="text-center d-none d-md-block">
          이미 가입하셨다면,{' '}
          <Link color="blue" to="/login">
            {t('여기')}
          </Link>
          를 눌러 로그인 페이지로 이동 할 수 있습니다
        </p>
        <p className="text-center d-md-block">
          <Link color="blue" to="/login">
            {t('로그인 페이지로 이동')}
          </Link>
        </p>
        <Row>
          <Col>
            <Form onSubmit={this.onSubmit} className="px-2 px-sm-0">
              <FormGroup>
                <Input
                  label={t('label.email')}
                  placeholderMessage={t('사용할 이메일 주소를 입력해주세요')}
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
                  placeholderMessage={t('이름이나 별명을 알려주세요')}
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
                  <span>페이스북 로그인</span>
                </div>
              </Button>
              <Button color="google" className="g-image-text-button ml-3">
                <div>
                  <span>
                    <img src={google} alt="GOOGLE" />
                  </span>
                  <span>구글 로그인</span>
                </div>
              </Button>
            </FormGroup>
            <FormGroup>
              <Button color="naver" className="mb-2 mb-lg-0 g-image-text-button ml-3">
                <div>
                  <span>
                    <img src={naver} alt="NAVER" />
                  </span>
                  <span>네이버 로그인</span>
                </div>
              </Button>
              <Button color="kakao" className="g-image-text-button ml-3">
                <div>
                  <span>
                    <img src={kakao} alt="KAKAO" />
                  </span>
                  <span>카카오 로그인</span>
                </div>
              </Button>
            </FormGroup>
          </Col>
        </Row>
        <p className="text-center px-2 px-sm-0">
          가입 시{' '}
          <Link color="blue" to="/login">
            {t('이용약관')}
          </Link>
          에 동의하고,{' '}
          <Link color="blue" to="/login">
            {t('개인정보 취급정책')}
          </Link>
          에 숙지하였음을 인정합니다.
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
