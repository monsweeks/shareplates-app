import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { addMessage, setUserInfo } from '@/actions';
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
import { DATETIME_FORMATS, ROLE_CODES } from '@/constants/constants';
import LANGUAGES from '@/languages/languages';
import './UserForm.scss';
import { UserPropTypes } from '@/proptypes';

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

class UserForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      iconType: 'avatar',
      isCanBeAdmin: false,
      init: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.init && props.user) {
      return {
        isCanBeAdmin: props.user.roleCode === 'SUPER_MAN',
        iconType:
          props.user && props.user.info && props.user.info.icon && props.user.info.icon.type
            ? props.user.info.icon.type
            : 'avatar',
        init: true,
      };
    }

    return null;
  }

  changeTab = (iconType) => {
    this.setState({
      iconType,
    });
  };

  render() {
    const { t, onSubmit, user, onChange, onChangeFile, onChangeAvatar } = this.props;
    const { iconType, isCanBeAdmin } = this.state;

    return (
      <Form onSubmit={onSubmit} className="flex-grow-1 d-flex flex-column">
        {user && (
          <>
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
                  {iconType === 'image' && <ImageBuilder info={user.info} onChangeFile={onChangeFile} />}
                  {iconType === 'avatar' && <AvatarBuilder info={user.info} onChange={onChangeAvatar} />}
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
                onChange={onChange('name')}
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
                onChange={onChange('dateTimeFormat')}
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
                onClick={onChange('language')}
              />
            </FormGroup>
            {isCanBeAdmin && (
              <>
                <hr className="g-dashed mb-3" />
                <SubLabel>{t('권한')}</SubLabel>
                <Description>{t('시스템에서 사용자가 가지는 권한입니다.')}</Description>
                <FormGroup>
                  <RadioButton items={ROLE_CODES} value={user.roleCode} outline onClick={onChange('roleCode')} />
                </FormGroup>
                <hr className="g-dashed mb-3" />
                <SubLabel>{t('활성화 권한')}</SubLabel>
                <Description>{t('현재 활성화된 사용자가 권한입니다.')}</Description>
                <FormGroup>
                  <RadioButton
                    items={ROLE_CODES}
                    value={user.activeRoleCode}
                    outline
                    onClick={onChange('activeRoleCode')}
                  />
                </FormGroup>
              </>
            )}
            <hr className="g-dashed mb-3" />
            <SubLabel>{t('가입일')}</SubLabel>
            <DetailValue className="flex-grow-1" uppercase border={false}>
              <DateTime value={user.creationDate} dateTimeFormat={user.dateTimeFormat} />
            </DetailValue>
            <BottomButton onList={() => {}} onEdit={() => {}} />
          </>
        )}
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUserInfo: (user, grps, shareCount) => dispatch(setUserInfo(user, grps, shareCount)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(UserForm)));

UserForm.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  user: UserPropTypes,
  onChangeFile: PropTypes.func,
  onChangeAvatar: PropTypes.func,
};
