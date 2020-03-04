import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { setOrganization, setPageColor, setUser } from 'actions';
import { PageTitle, RegisterLayout } from '@/layouts';
import {
  Button,
  Description,
  Form,
  FormGroup,
  IconSelector,
  Input,
  Popup,
  SubLabel,
  TextArea,
  UserManager,
  UserSearchPopup,
} from '@/components';
import request from '@/utils/request';

import './NewTopic.scss';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import CheckBoxInput from '@/components/CheckBoxInput/CheckBoxInput';

const breadcrumbs = [
  {
    name: '토픽',
    to: '/topics',
  },
  {
    name: '새 토픽',
    to: '/topics/new',
  },
];

class NewTopic extends Component {
  static getDerivedStateFromProps(props, state) {
    const { user } = props;

    if (!state.init && props.user && props.user.id) {
      const { topic } = state;
      topic.users = [
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      ];

      return {
        topic,
        init: true,
      };
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      topic: {
        name: '',
        summary: '',
        organizationId: '',
        iconIndex: null,
        users: [],
        privateYn: false,
      },
      existName: false,
      init: false,
      openUserPopup: false,
    };

    this.checkNameExistDebounced = debounce(this.checkNameExist, 400);
  }

  componentDidMount() {
    const { setPageColor: setPageColorReducer } = this.props;
    setPageColorReducer('rgb(11, 154, 223)');
  }

  componentWillUnmount() {
    this.checkNameExistDebounced.cancel();
  }

  checkNameExist = (email) => {
    request.get(
      '/api/users/exists',
      { email },
      (data) => {
        this.setState({
          existName: data,
        });
      },
      null,
      true,
    );
  };

  onChange = (field) => (value) => {
    const { topic } = this.state;

    if (field === 'email') {
      this.checkNameExistDebounced(value);
    }

    const v = {};
    v[field] = value;

    this.setState({
      topic: { ...topic, ...v },
    });
  };

  setOpenUserPopup = (openUserPopup) => {
    this.setState({
      openUserPopup,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { topic } = this.state;
    const { t, history, addMessage: addMessageReducer } = this.props;

    if (topic.passwordConfirm !== topic.password) {
      addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('validation.badInput'), t('validation.notEqualPassword'));
      return;
    }

    request.post('/api/topics', topic.toJS(), (data) => {
      // eslint-disable-next-line react/destructuring-assignment

      console.log(data);
      history.push('/topics/join/success');
    });
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { t, addMessage: addMessageReducer } = this.props;
    const { topic, existName, openUserPopup } = this.state;

    console.log(existName);

    return (
      <RegisterLayout className="new-topic-wrapper">
        <PageTitle list={breadcrumbs}>{t('새로운 토픽 만들기')}</PageTitle>
        <hr className='d-none d-sm-block' />
        <Form onSubmit={this.onSubmit} className="flex-grow-1 px-2">
          <SubLabel>{t('아이콘')}</SubLabel>
          <Description>
            토픽을 나타내는 아이콘을 선택하거나, 직접 이미지를 업로드할 수 있습니다. 토픽이 카드 형태로 보여지거나,
            토픽의 이름 생략하고, 아이콘으로 표현하는 등에 사용됩니다.
          </Description>
          <FormGroup>
            <IconSelector className="icon-selector" iconIndex={topic.iconIndex} onChange={this.onChange('iconIndex')} />
          </FormGroup>
          <hr className="g-dashed" />
          <SubLabel>{t('이름')}</SubLabel>
          <Description>토픽 이름을 입력해주세요. 포함되는 ORGANIZAITON에서 유일해야 이름을 가져야 합니다.</Description>
          <FormGroup>
            <Input
              label={t('label.name')}
              value={topic.name}
              required
              minLength={2}
              maxLength={100}
              onChange={this.onChange('name')}
              simple
              border
              componentClassName="border-primary"
            />
          </FormGroup>
          <hr className="g-dashed" />
          <SubLabel>{t('설명')}</SubLabel>
          <Description>토픽에 대한 설명을 입력해주세요.</Description>
          <FormGroup>
            <TextArea
              label={t('설명')}
              placeholderMessage="새로운 토픽에 대한 설명을 입력해주세요"
              value={topic.summary}
              onChange={this.onChange('summary')}
              simple
              componentClassName="border-primary"
            />
          </FormGroup>
          <hr className="g-dashed" />
          <SubLabel>{t('비공개 토픽')}</SubLabel>
          <Description>
            비공개 토픽으로 만들면, 토픽이 검색 등에 노출되지 않으며, 지정한 사용자만 접근이 가능합니다.
          </Description>
          <FormGroup>
            <CheckBoxInput
              size="sm"
              type="checkbox"
              value={topic.privateYn}
              onChange={this.onChange('privateYn')}
              label="비밀 토픽입니다"
            />
          </FormGroup>
          <hr className="g-dashed" />
          <div className="position-relative">
            <SubLabel>{t('토픽 관리자')}</SubLabel>
            <Description>토픽을 수정하고 삭제할 수 있는 관리자를 지정합니다.</Description>
            <Button
              className="manager-button"
              color="primary"
              size="sm"
              onClick={() => {
                this.setOpenUserPopup(true);
              }}
            >
              사용자 관리
            </Button>
          </div>
          <FormGroup>
            <UserManager
              emptyBackgroundColor='#F6F6F6'
              onRemove={(id) => {
                const users = topic.users.splice(0);
                const index = users.findIndex((u) => u.id === id);
                users.splice(index, 1);
                this.setState({
                  topic: { ...topic, users },
                });
              }}
              className="selected-user mt-3 mt-sm-0"
              lg={3}
              md={4}
              sm={6}
              xl={12}
              users={topic.users}
            />
          </FormGroup>
          <FormGroup className="text-center mb-3 mb-sm-0">
            <Button className="px-4" color="primary">
              {t('만들기')}
            </Button>
          </FormGroup>
        </Form>

        {openUserPopup && (
          <Popup title="사용자 검색" open setOpen={this.setOpenUserPopup}>
            <UserSearchPopup
              users={topic.users}
              setOpen={this.setOpenUserPopup}
              onApply={(users) => {
                const info = { ...topic };
                info.users = users;
                this.setState({
                  topic: info,
                });
              }}
            />
          </Popup>
        )}
      </RegisterLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    organizations: state.user.organizations,
    organizationId: state.user.organizationId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user, organizations) => dispatch(setUser(user, organizations)),
    setOrganization: (organizationId) => dispatch(setOrganization(organizationId)),
    setPageColor: (pageColor) => dispatch(setPageColor(pageColor)),
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(NewTopic)));

NewTopic.defaultProps = {
  t: null,
};

NewTopic.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    picturePath: PropTypes.string,
  }),
  t: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  addMessage: PropTypes.func,
  setPageColor: PropTypes.func,
};
