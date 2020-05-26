import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import request from '@/utils/request';
import { addMessage, setUserInfo } from '@/actions';
import { PageTitle, RegisterLayout } from '@/layouts';
import {
  AvatarBuilder,
  BottomButton,
  DateTime,
  Description,
  DetailValue,
  Form,
  FormGroup,
  ImageBuilder,
  Input,
  Nav,
  NavItem,
  RadioButton,
  Selector,
  SubLabel,
} from '@/components';
import { DATETIME_FORMATS } from '@/constants/constants';
import LANGUAGES from '@/languages/languages';
import './EditMyInfo.scss';
import { convertUser } from '@/pages/Users/util';

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

const tabs = [
  {
    key: 'avatar',
    name: '아바타',
  },
  {
    key: 'image',
    name: '이미지',
  },
];

class EditMyInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      iconType: 'avatar',
    };
  }

  componentDidMount() {
    this.getMyInfo();
  }

  getMyInfo = () => {
    request.get(
      '/api/users/my-info',
      null,
      (data) => {
        const { user } = data;
        if (user && !user.dateTimeFormat) user.dateTimeFormat = DATETIME_FORMATS[0].key;
        if (user && !user.language) user.language = 'ko';

        const next = convertUser(user);

        this.setState({
          user: next|| {},
          iconType : next && next.info.icon && next.info.icon.type ? next.info.icon.type : 'avatar'
        });
      },
      () => {
        this.setState({
          user: {},
        });
      },
    );
  };

  onChange = (field) => (value) => {
    const { user } = this.state;
    const obj = {};
    obj[field] = value;

    this.setState({
      user: { ...user, ...obj },
    });
  };

  onChangeAvatar = (value) => {
    const { user } = this.state;
    const next = { ...user };
    next.info.icon.type = 'avatar';
    next.info.icon.data = value;

    this.setState({
      user: next,
    });
  };

  getFileType = (file) => {
    if (!/^image\//.test(file.type)) {
      return 'image';
    }
    if (!/^video\//.test(file.type)) {
      return 'video';
    }
    return 'file';
  };

  onChangeFile = (file) => {
    const {
      user: { id },
    } = this.state;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('size', file.size);
    formData.append('type', this.getFileType(file));

    request.post(`/api/users/${id}/image`, formData, (data) => {
      const { user } = this.state;
      const obj = {};
      obj.info = {
        icon: {
          type: 'image',
          data: {
            id: data.id,
            uuid: data.uuid,
          },
        },
      };

      this.setState({
        user: { ...user, ...obj },
      });
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { user } = this.state;
    const { setUserInfo: setUserInfoReducer } = this.props;
    const next = { ...user };
    next.info = JSON.stringify(next.info);

    request.put('/api/users/my-info', next, (data) => {
      setUserInfoReducer(convertUser(data.user) || {}, data.grps);
    });
  };

  changeTab = (iconType) => {
    this.setState({
      iconType,
    });
  };

  render() {
    const { t } = this.props;
    const { user, iconType } = this.state;

    return (
      <RegisterLayout>
        <PageTitle list={breadcrumbs} border>{t('내 정보 수정')}</PageTitle>
        <Form onSubmit={this.onSubmit} className="flex-grow-1 d-flex flex-column">
          <SubLabel>{t('label.email')}</SubLabel>
          <Description>
            {t('가입된 사용자 이메일 정보입니다. 로그인 아이디로 사용되며, 변경할 수 없습니다.')}
          </Description>
          <DetailValue uppercase border={false}>
            {user.email}
          </DetailValue>
          <SubLabel>{t('사용자 아이콘')}</SubLabel>
          <Description>{t('이미지를 직접 업로드하거나, 아바타를 만들어서 나를 표현할 수 있습니다.')}</Description>
          <FormGroup>
            <div className="g-tabs mt-2">
              <Nav className="tabs" tabs>
                {tabs.map((tab) => {
                  return (
                    <NavItem
                      key={tab.key}
                      className={iconType === tab.key ? 'focus' : ''}
                      onClick={() => {
                        this.changeTab(tab.key);
                      }}
                    >
                      {tab.name}
                    </NavItem>
                  );
                })}
              </Nav>
              <div className="g-tabs-content">
                {iconType === 'image' && <ImageBuilder info={user.info} onChangeFile={this.onChangeFile} />}
                {iconType === 'avatar' && <AvatarBuilder info={user.info} onChange={this.onChangeAvatar} />}
              </div>
            </div>
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('label.name')}</SubLabel>
          <Description>{t('SHAREPLATES에서 사용되는 사용자의 별명이나, 이름입니다.')}</Description>
          <FormGroup>
            <Input
              label={t('label.name')}
              value={user.name}
              required
              minLength={2}
              maxLength={100}
              onChange={this.onChange('name')}
              simple
              border
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('날짜 형식')}</SubLabel>
          <Description>{t('날짜 형식의 데이터를 표현할 때 사용되는 날짜 형식을 선택합니다.')}</Description>
          <FormGroup>
            <Selector
              outline
              items={DATETIME_FORMATS}
              value={user.dateTimeFormat}
              onChange={this.onChange('dateTimeFormat')}
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('언어')}</SubLabel>
          <Description>{t('사용할 언어를 선택할 수 있습니다.')}</Description>
          <FormGroup>
            <RadioButton
              items={Object.keys(LANGUAGES)
                .sort()
                .reverse()
                .map((d) => {
                  return {
                    key: d,
                    value: t(d),
                  };
                })}
              value={user.language}
              outline
              onClick={this.onChange('language')}
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('가입일')}</SubLabel>
          <DetailValue className="flex-grow-1" uppercase border={false}>
            <DateTime value={user.creationDate} dateTimeFormat={user.dateTimeFormat} />
          </DetailValue>
          <BottomButton onList={() => {}} onEdit={() => {}} />
        </Form>
      </RegisterLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUserInfo: (user, grps) => dispatch(setUserInfo(user, grps)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(EditMyInfo)));

EditMyInfo.propTypes = {
  t: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
