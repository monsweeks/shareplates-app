import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
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
import { UserPropTypes } from '@/proptypes';

class UserForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      iconType: 'avatar',
      init: false,
      tabs: [
        {
          key: 'avatar',
          name: t('label.avatar'),
        },
        {
          key: 'image',
          name: t('label.image'),
        },
      ],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.init && props.user) {
      return {
        iconType: (props.user && props.user.info && props.user.info.icon && props.user.info.icon.type) || 'avatar',
        init: true,
      };
    }

    return null;
  }

  render() {
    const { t } = this.props;
    const { user, isCanBeAdmin } = this.props;
    const { onSubmit, onChange, onList, onDelete, onCancel } = this.props;
    const { iconType, tabs } = this.state;

    return (
      <Form onSubmit={onSubmit} className="flex-grow-1 d-flex flex-column">
        {user && (
          <>
            <SubLabel>{t('label.email')}</SubLabel>
            <Description>{t('msg.emailDesc')}</Description>
            <DetailValue uppercase border={false}>
              {user.email}
            </DetailValue>
            <SubLabel>{t('label.userIcon')}</SubLabel>
            <Description>{t('msg.avatarDesc')}</Description>
            <FormGroup>
              <div className="g-tabs mt-2">
                <Nav className="tabs" tabs>
                  {tabs.map((tab) => {
                    return (
                      <NavItem
                        key={tab.key}
                        className={iconType === tab.key ? 'focus' : ''}
                        onClick={() => {
                          this.setState({
                            iconType: tab.key,
                          });
                        }}
                      >
                        {tab.name}
                      </NavItem>
                    );
                  })}
                </Nav>
                <div className="g-tabs-content">
                  {iconType === 'image' && <ImageBuilder info={user.info} onChangeFile={onChange('file')} />}
                  {iconType === 'avatar' && <AvatarBuilder info={user.info} onChange={onChange('avatar')} />}
                </div>
              </div>
            </FormGroup>
            <hr className="g-dashed mb-3" />
            <SubLabel>{t('label.name')}</SubLabel>
            <Description>{t('msg.nameDesc')}</Description>
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
            <SubLabel>{t('label.dateFormat')}</SubLabel>
            <Description>{t('msg.dateFormatDesc')}</Description>
            <FormGroup>
              <Selector
                outline
                items={DATETIME_FORMATS}
                value={user.dateTimeFormat}
                onChange={onChange('dateTimeFormat')}
              />
            </FormGroup>
            <hr className="g-dashed mb-3" />
            <SubLabel>{t('label.language')}</SubLabel>
            <Description>{t('msg.languageDesc')}</Description>
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
                <SubLabel>{t('label.role')}</SubLabel>
                <Description>{t('msg.roleDesc')}</Description>
                <FormGroup>
                  <RadioButton items={ROLE_CODES} value={user.roleCode} outline onClick={onChange('roleCode')} />
                </FormGroup>
                <hr className="g-dashed mb-3" />
                <SubLabel>{t('label.appliedRole')}</SubLabel>
                <Description>{t('msg.appliedRoleDesc')}</Description>
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
            <SubLabel>{t('label.joinDate')}</SubLabel>
            <DetailValue className="flex-grow-1" uppercase border={false}>
              <DateTime value={user.creationDate} dateTimeFormat={user.dateTimeFormat} nullValue="N/A" />
            </DetailValue>
            <BottomButton onDelete={onDelete} onList={onList} onSave={() => {}} onCancel={onCancel} />
          </>
        )}
      </Form>
    );
  }
}

export default withRouter(withTranslation()(UserForm));

UserForm.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  user: UserPropTypes,
  isCanBeAdmin: PropTypes.bool,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onList: PropTypes.func,
  onCancel: PropTypes.func,
};
