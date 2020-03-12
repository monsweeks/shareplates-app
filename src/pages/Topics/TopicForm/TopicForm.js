import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import {
  BottomButton,
  Button,
  CheckBoxInput,
  Description,
  Form,
  FormGroup,
  IconSelector,
  Input,
  Popup,
  Selector,
  SubLabel,
  TextArea,
  UserManager,
  UserSearchPopup,
} from '@/components';
import './TopicForm.scss';

class TopicForm extends Component {
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
      openUserPopup: false,
      initialized: false,
    };

    this.checkNameExistDebounced = debounce(this.checkNameExist, 400);
  }

  static getDerivedStateFromProps(props, state) {
    let { initialized } = state;
    if (initialized) {
      return null;
    }

    const { edit, user } = props;
    let topic = { ...state.topic };

    if (edit && props.topic) {
      topic = props.topic;
      initialized = true;
    }

    if (!edit) {
      if (
        !topic.organizationId &&
        props.organizations &&
        props.organizations.length > 0 &&
        topic.users.length < 1 &&
        props.user &&
        props.user.id
      ) {
        topic.organizationId = props.organizations[0].id;
        topic.users = [
          {
            id: user.id,
            email: user.email,
            name: user.name,
            organizationId: props.organizations && props.organizations.length > 0 ? props.organizations[0].id : null,
            info: user.info,
          },
        ];
        initialized = true;
      }
    }

    return {
      topic,
      initialized,
    };
  }

  componentWillUnmount() {
    this.checkNameExistDebounced.cancel();
  }

  checkNameExist = (name) => {
    const { topic } = this.state;

    request.get(
      '/api/topics/name',
      { organizationId: topic.organizationId, name },
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

    if (field === 'name') {
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
    const { t, addMessage: addMessageReducer, onSave } = this.props;

    if (topic.passwordConfirm !== topic.password) {
      addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('validation.badInput'), t('validation.notEqualPassword'));
      return;
    }

    onSave(topic);
  };

  render() {
    const { t, organizations, saveText, onCancel } = this.props;
    const { topic, existName, openUserPopup } = this.state;

    return (
      <>
        <Form onSubmit={this.onSubmit} className="topic-form-wrapper flex-grow-1">
          <SubLabel>{t('ORGANIZATION')}</SubLabel>
          <Description>{t('message.selectOrgForTopic')}</Description>
          <FormGroup>
            <Selector
              outline
              className="organization-selector"
              items={organizations.map((org) => {
                return {
                  key: org.id,
                  value: org.name,
                };
              })}
              value={topic.organizationId}
              onChange={this.onChange('organizationId')}
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('label.icon')}</SubLabel>
          <Description>{t('message.topicIconDesc')}</Description>
          <FormGroup>
            <IconSelector className="icon-selector" iconIndex={topic.iconIndex} onChange={this.onChange('iconIndex')} />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('label.name')}</SubLabel>
          <Description>{t('message.topicNameDesc')}</Description>
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
            {existName && <div className="small text-danger mt-2">{t('validation.dupName')}</div>}
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('label.desc')}</SubLabel>
          <Description>{t('message.topicDescDesc')}</Description>
          <FormGroup>
            <TextArea
              label={t('label.desc')}
              placeholderMessage={t('message.topicDescDesc')}
              value={topic.summary}
              onChange={this.onChange('summary')}
              simple
              componentClassName="border-primary"
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('label.privateTopic')}</SubLabel>
          <Description>{t('message.privateTopicDesc')}</Description>
          <FormGroup>
            <CheckBoxInput
              size="sm"
              type="checkbox"
              value={topic.privateYn}
              onChange={this.onChange('privateYn')}
              label={t('message.privateTopic')}
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <div className="position-relative">
            <SubLabel>{t('label.topicAdmin')}</SubLabel>
            <Description>{t('message.topicUserDesc')}</Description>
            <Button
              className="manager-button"
              color="primary"
              size="xs"
              onClick={() => {
                this.setOpenUserPopup(true);
              }}
            >
              {t('label.userManagement')}
            </Button>
          </div>
          <FormGroup>
            <UserManager
              emptyBackgroundColor="#F6F6F6"
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
          <BottomButton
            className="text-center"
            saveText={saveText}
            onSave={() => {}}
            onCancel={onCancel}
          />
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
      </>
    );
  }
}

export default withRouter(withTranslation()(TopicForm));

TopicForm.defaultProps = {
  t: null,
  edit: false,
  saveText: '',
  organizations: [],
};

TopicForm.propTypes = {
  edit: PropTypes.bool,
  topic: PropTypes.shape({
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
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  addMessage: PropTypes.func,
  onSave: PropTypes.func,
  saveText: PropTypes.string,
  onCancel: PropTypes.func,
};
