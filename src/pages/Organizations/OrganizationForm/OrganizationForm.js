import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  BottomButton,
  Button,
  Description,
  Form,
  FormGroup,
  Input,
  Popup,
  SubLabel,
  SubTitle,
  TextArea,
  UserManager,
  UserSearchPopup,
} from '@/components';
import './OrganizationForm.scss';

class OrganizationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      organization: {
        name: '',
        description: '',
        admins: [],
        members: [],
      },
      openAdminPopup: false,
      openMemberPopup: false,
      initialized: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let { initialized } = state;
    if (initialized) {
      return null;
    }

    const { edit, user } = props;
    let organization = { ...state.organization };

    if (edit && props.organization) {
      organization = props.organization;
      initialized = true;
    }

    if (!edit) {
      if (organization.admins.length < 1 && props.user && props.user.id) {
        organization.admins = [
          {
            id: user.id,
            email: user.email,
            name: user.name,
            info: user.info,
          },
        ];
        initialized = true;
      }
    }

    return {
      organization,
      initialized,
    };
  }

  onChange = (field) => (value) => {
    const { organization } = this.state;

    const v = {};
    v[field] = value;

    this.setState({
      organization: { ...organization, ...v },
    });
  };

  setOpenPopup = (type, value) => {
    const obj = {};
    obj[type] = value;
    this.setState(obj);
  };

  setClosePopup = () => {
    this.setState({
      openAdminPopup: false,
      openMemberPopup: false,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { organization } = this.state;
    const { onSave } = this.props;

    onSave(organization);
  };

  onApply = (isAdmin, users) => {
    const { organization } = this.state;
    const info = { ...organization };
    if (isAdmin) {
      info.admins = users;
      info.admins.forEach((admin) => {
        const inx = info.members.findIndex((member) => member.id === admin.id);
        if (inx > -1) {
          info.members.splice(inx, 1);
        }
      });
    } else {
      info.members = users;

      info.members.forEach((member) => {
        const inx = info.admins.findIndex((admin) => admin.id === member.id);
        if (inx > -1) {
          info.admins.splice(inx, 1);
        }
      });
    }

    this.setState({
      organization: info,
    });
  };

  render() {
    const { t, saveText, onCancel } = this.props;
    const { organization, existName, openAdminPopup, openMemberPopup } = this.state;

    return (
      <>
        <Form onSubmit={this.onSubmit} className="organization-form-wrapper flex-grow-1 px-2">
          <SubTitle>{t('GENERAL INFO')}</SubTitle>
          <SubLabel>{t('label.name')}</SubLabel>
          <Description>{t('message.organizationNameDesc')}</Description>
          <FormGroup>
            <Input
              label={t('label.name')}
              value={organization.name}
              required
              minLength={2}
              maxLength={100}
              onChange={this.onChange('name')}
              simple
              border
              componentClassName="border-primary"
            />
            {existName && <div className="small text-danger mt-2">{t('validation.dupName')}</div>}
          </FormGroup>
          <SubLabel>{t('label.desc')}</SubLabel>
          <Description>{t('message.organizationDescDesc')}</Description>
          <FormGroup>
            <TextArea
              label={t('label.desc')}
              placeholderMessage={t('message.organizationDescDesc')}
              value={organization.description}
              onChange={this.onChange('description')}
              simple
              componentClassName="border-primary"
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubTitle>{t('USERS')}</SubTitle>
          <div className="position-relative">
            <SubLabel>{t('label.organizationAdmin')}</SubLabel>
            <Description>{t('message.organizationAdminDesc')}</Description>
            <Button
              className="manager-button"
              color="primary"
              size="xs"
              onClick={() => {
                this.setOpenPopup('openAdminPopup', true);
              }}
            >
              {t('label.userManagement')}
            </Button>
          </div>
          <FormGroup>
            <UserManager
              onRemove={(id) => {
                const admins = organization.admins.splice(0);
                const index = admins.findIndex((u) => u.id === id);
                admins.splice(index, 1);
                this.setState({
                  organization: { ...organization, admins },
                });
              }}
              className="selected-user mt-3 mt-sm-0"
              lg={3}
              md={4}
              sm={6}
              xl={12}
              users={organization.admins}
            />
          </FormGroup>
          <div className="position-relative">
            <SubLabel>{t('label.organizationMember')}</SubLabel>
            <Description>{t('message.organizationUserDesc')}</Description>
            <Button
              className="manager-button"
              color="primary"
              size="xs"
              onClick={() => {
                this.setOpenPopup('openMemberPopup', true);
              }}
            >
              {t('label.userManagement')}
            </Button>
          </div>
          <FormGroup>
            <UserManager
              onRemove={(id) => {
                const members = organization.members.splice(0);
                const index = members.findIndex((u) => u.id === id);
                members.splice(index, 1);
                this.setState({
                  organization: { ...organization, members },
                });
              }}
              className="selected-user mt-3 mt-sm-0"
              lg={3}
              md={4}
              sm={6}
              xl={12}
              users={organization.members}
            />
          </FormGroup>
          <BottomButton className="text-center" saveText={saveText} onSave={() => {}} onCancel={onCancel} />
        </Form>
        {(openAdminPopup || openMemberPopup) && (
          <Popup title="사용자 검색" open setOpen={this.setOpenUserPopup}>
            <UserSearchPopup
              users={openAdminPopup ? organization.admins : organization.members}
              setOpen={this.setClosePopup}
              onApply={(users) => {
                this.onApply(openAdminPopup, users);
              }}
              markedUsers={openAdminPopup ? organization.members : organization.admins}
              markedTag={openAdminPopup ? 'MEMBER' : 'ADMIN'}
            />
          </Popup>
        )}
      </>
    );
  }
}

export default withRouter(withTranslation()(OrganizationForm));

OrganizationForm.defaultProps = {
  t: null,
  edit: false,
  saveText: '',
};

OrganizationForm.propTypes = {
  edit: PropTypes.bool,
  organization: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  t: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),

  onSave: PropTypes.func,
  saveText: PropTypes.string,
  onCancel: PropTypes.func,
};
