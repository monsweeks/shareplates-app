import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import request from '@/utils/request';
import storage from '@/utils/storage';
import { addMessage, setUser } from '@/actions';
import './EditMyInfo.scss';
import { PageTitle, RegisterLayout } from '@/layouts';
import AvatarBuilder from '@/components/AvatarBuilder/AvatarBuilder';
import { Description, Form, SubLabel } from '@/components';

const breadcrumbs = [
  {
    name: '내 정보',
    to: '/users/my-info/edit',
  },
  {
    name: '수정',
    to: '/users/my-info',
  },
];

class EditMyInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    const email = storage.getItem('login', 'email');

    this.state = {
      email: email || '',
      password: '',
      saveEmail: !!email,
      loginResult: null,
    };
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

    const { email, password, saveEmail } = this.state;
    const { history, setUser: setUserReducer } = this.props;

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
            setUserReducer(data.user || {}, data.organizations);
            history.push('/');
          });
        } else {
          this.setState({
            loginResult: false,
          });
        }
      },
    );
  };

  render() {
    const { t } = this.props;

    return (
      <RegisterLayout>
        <PageTitle list={breadcrumbs}>{t('내 정보 수정')}</PageTitle>
        <hr className="d-none d-sm-block mb-3" />
        <Form onSubmit={this.onSubmit} className="flex-grow-1 px-2">
          <SubLabel>{t('사용자 아이콘')}</SubLabel>
          <Description className='mb-3'>{t('SHAREPLATES에서 사용되는 사용자의 아바타 아이콘을 만들 수 있습니다.')}</Description>
          <AvatarBuilder />
        </Form>
      </RegisterLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUser: (user, organizations) => dispatch(setUser(user, organizations)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(EditMyInfo)));

EditMyInfo.propTypes = {
  t: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
