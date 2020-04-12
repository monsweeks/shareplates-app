import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { addMessage } from 'actions';
import { Button, Col, Form, FormGroup, Input, Link, Row } from '@/components';
import request from '@/utils/request';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { CenterBoxLayout } from '@/layouts';
import './Register.scss';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: Map({
        id: '',
        email: '',
        name: '',
        password: '',
        passwordConfirm: '',
      }),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { user } = state;

    if (props.user && props.user.id !== state.user.get('id')) {
      return {
        user: user
          .set('id', props.user.id)
          .set('email', props.user.email)
          .set('name', props.user.name),
      };
    }

    return null;
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
    const { t, history, addMessage: addMessageReducer } = this.props;

    if (user.get('passwordConfirm') !== user.get('password')) {
      addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('validation.badInput'), t('validation.notEqualPassword'));
      return;
    }

    request.put('/api/users/register', user.toJS(), () => {
      history.push('/');
    });
  };

  render() {
    const { t, history } = this.props;
    const { user } = this.state;

    return (
      <CenterBoxLayout className="join-wrapper">
        <h1 className="text-center">REGISTER</h1>
        <p className="text-center d-md-block mb-0">
          비밀번호를 등록하면, 앞으로 이메일을 통해서도 로그인을 할 수 있습니다.
        </p>
        <Row className="mb-0 mb-sm-4">
          <Col>
            <Form onSubmit={this.onSubmit} className="px-2 px-sm-0">
              <FormGroup>
                <Input type="email" label={t('label.email')} value={user.get('email')} disabled />
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
                <Button
                  className="px-4 mr-2"
                  color="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push('/');
                  }}
                >
                  {t('다음에 등록')}
                </Button>
                <Button className="px-4" color="primary">
                  {t('등록')}
                </Button>
              </FormGroup>
            </Form>
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

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Register)));

Register.defaultProps = {
  t: null,
};

Register.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),
  t: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  addMessage: PropTypes.func,
};
