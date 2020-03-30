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
  TextArea,
  UserManager,
  UserSearchPopup,
} from '@/components';
import './GrpForm.scss';

class GrpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grp: {
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
    let grp = { ...state.grp };

    if (edit && props.grp) {
      grp = props.grp;
      initialized = true;
    }

    if (!edit) {
      if (grp.admins.length < 1 && props.user && props.user.id) {
        grp.admins = [
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
      grp,
      initialized,
    };
  }

  onChange = (field) => (value) => {
    const { grp } = this.state;

    const v = {};
    v[field] = value;

    this.setState({
      grp: { ...grp, ...v },
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

    const { grp } = this.state;
    const { onSave } = this.props;

    onSave(grp);
  };

  onApply = (isAdmin, users) => {
    const { grp } = this.state;
    const info = { ...grp };
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
      grp: info,
    });
  };

  render() {
    const { t, saveText, onCancel } = this.props;
    const { grp, existName, openAdminPopup, openMemberPopup } = this.state;

    return (
      <>
        <Form onSubmit={this.onSubmit} className="grp-form-wrapper flex-grow-1">
          <SubLabel>{t('label.name')}</SubLabel>
          <Description>{t('message.grpNameDesc')}</Description>
          <FormGroup>
            <Input
              label={t('label.name')}
              value={grp.name}
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
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('label.desc')}</SubLabel>
          <Description>{t('message.grpDescDesc')}</Description>
          <FormGroup>
            <TextArea
              label={t('label.desc')}
              placeholderMessage={t('message.grpDescDesc')}
              value={grp.description}
              onChange={this.onChange('description')}
              simple
              componentClassName="border-primary"
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <div className="position-relative">
            <SubLabel>{t('label.grpAdmin')}</SubLabel>
            <Description>{t('message.grpAdminDesc')}</Description>
            <Button
              className="g-circle-icon-button manager-button"
              color="primary"
              onClick={() => {
                this.setOpenPopup('openAdminPopup', true);
              }}
            >
              <i className="fal fa-plus" />
            </Button>
          </div>
          <FormGroup className="mt-2">
            <UserManager
              onRemove={(id) => {
                const admins = grp.admins.splice(0);
                const index = admins.findIndex((u) => u.id === id);
                admins.splice(index, 1);
                this.setState({
                  grp: { ...grp, admins },
                });
              }}
              lg={3}
              md={4}
              sm={6}
              xl={12}
              users={grp.admins}
              className='bg-light'
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <div className="position-relative">
            <SubLabel>{t('label.grpMember')}</SubLabel>
            <Description>{t('message.grpUserDesc')}</Description>
            <Button
              className="g-circle-icon-button manager-button"
              color="primary"
              onClick={() => {
                this.setOpenPopup('openMemberPopup', true);
              }}
            >
              <i className="fal fa-plus" />
            </Button>
          </div>
          <FormGroup className="mt-2">
            <UserManager
              onRemove={(id) => {
                const members = grp.members.splice(0);
                const index = members.findIndex((u) => u.id === id);
                members.splice(index, 1);
                this.setState({
                  grp: { ...grp, members },
                });
              }}
              lg={3}
              md={4}
              sm={6}
              xl={12}
              users={grp.members}
              className='bg-light'
            />
          </FormGroup>
          <BottomButton className="text-right mt-4" saveText={saveText} onSave={() => {}} onCancel={onCancel} />
        </Form>
        {(openAdminPopup || openMemberPopup) && (
          <Popup title="사용자 검색" open setOpen={this.setClosePopup}>
            <UserSearchPopup
              users={openAdminPopup ? grp.admins : grp.members}
              setOpen={this.setClosePopup}
              onApply={(users) => {
                this.onApply(openAdminPopup, users);
              }}
              markedUsers={openAdminPopup ? grp.members : grp.admins}
              markedTag={openAdminPopup ? 'MEMBER' : 'ADMIN'}
            />
          </Popup>
        )}
      </>
    );
  }
}

export default withRouter(withTranslation()(GrpForm));

GrpForm.defaultProps = {
  t: null,
  edit: false,
  saveText: '',
};

GrpForm.propTypes = {
  edit: PropTypes.bool,
  grp: PropTypes.shape({
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
