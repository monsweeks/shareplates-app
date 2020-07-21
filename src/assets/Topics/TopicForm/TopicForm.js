import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import {
  BottomButton,
  Description,
  Form,
  FormGroup,
  Input,
  Popup,
  RadioButton,
  Selector,
  SubLabel,
  TextArea,
} from '@/components';
import { FormLevelProperties, UserManager, UserSearchPopup } from '@/assets';
import {
  DEFAULT_TOPIC_CONTENT,
  PAGE_TRANSFER_ANIMATION,
  TOPIC_FONT_FAMILIES,
  TOPIC_FONT_SIZES,
} from '@/assets/Topics/PageEditor/PageController/constants';
import './TopicForm.scss';
import dialog from '@/utils/dialog';

const privateTopicValues = [
  {
    key: false,
    value: '공개 토픽',
  },
  {
    key: true,
    value: '비공개 토픽',
  },
];

class TopicForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: {
        name: '',
        summary: '',
        grpId: '',
        users: [],
        privateYn: false,
        content: JSON.parse(JSON.stringify(DEFAULT_TOPIC_CONTENT)),
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
      topic = { ...props.topic };
      initialized = true;
    }

    if (!edit) {
      if (
        !topic.grpId &&
        props.grps &&
        props.grps.length > 0 &&
        topic.users.length < 1 &&
        props.user &&
        props.user.id
      ) {
        if (props.grpId) {
          topic.grpId = props.grpId;
        } else {
          topic.grpId = props.grps[0].id;
        }

        topic.users = [
          {
            id: user.id,
            email: user.email,
            name: user.name,
            grpId: props.grps && props.grps.length > 0 ? props.grps[0].id : null,
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
      `/api/groups/${topic.grpId}/topics/exist`,
      { name, topicId: topic.id },
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

  onChangeTopicProperties = (key, value) => {
    const { topic } = this.state;

    const next = { ...topic };
    const content = { ...next.content };
    const topicProperties = { ...content.topicProperties };

    topicProperties[key] = value;
    content.topicProperties = topicProperties;
    next.content = content;

    this.setState({
      topic: next,
    });
  };

  onChangeTopicSettings = (key, value) => {
    const { topic } = this.state;

    const next = { ...topic };
    const content = { ...next.content };
    const settings = { ...content.settings };

    settings[key] = value;
    content.settings = settings;
    next.content = content;

    this.setState({
      topic: next,
    });
  };

  setOpenUserPopup = (openUserPopup) => {
    this.setState({
      openUserPopup,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { topic, existName } = this.state;
    const { t, onSave } = this.props;

    if (!topic.users || topic.users.length < 1) {
      dialog.setMessage(
        MESSAGE_CATEGORY.INFO,
        t('validation.badInput'),
        t('최소 1명의 토픽 관리자는 지정되어야 합니다.'),
      );
      return;
    }

    if (existName) {
      dialog.setMessage(
        MESSAGE_CATEGORY.INFO,
        t('validation.badInput'),
        t('그룹에 동일한 이름의 토픽 이름이 존재합니다.'),
      );
      return;
    }

    const next = { ...topic };
    next.content = JSON.stringify(next.content);
    onSave(next);
  };

  render() {
    const { t, grps, saveText, onCancel, edit } = this.props;
    const { topic, existName, openUserPopup } = this.state;
    const {
      content: { topicProperties },
      content: { settings },
    } = topic;

    return (
      <>
        <Form onSubmit={this.onSubmit} className="topic-form-wrapper flex-grow-1 d-flex flex-column">
          {!edit && <hr className="g-dashed mb-3" />}
          <SubLabel>{t('그룹')}</SubLabel>
          <Description>{t('message.selectGrpForTopic')}</Description>
          <FormGroup>
            <Selector
              outline
              className="grp-selector"
              items={grps.map((org) => {
                return {
                  key: org.id,
                  value: org.name,
                };
              })}
              value={topic.grpId}
              onChange={this.onChange('grpId')}
              minWidth="140px"
            />
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
            <RadioButton
              outline
              items={privateTopicValues}
              value={topic.privateYn}
              onClick={this.onChange('privateYn')}
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('토픽 기본 스타일')}</SubLabel>
          <Description>
            {t(
              '토픽의 컨텐츠에 지정할 기본적인 스타일 정보를 선택합니다. 기본 스타일은 토픽, 챕터, 페이지 각각의 스타일을 지정할 수 있으며, 페이지에 지정된 스타일이 업다면, 챕터의 스타일이 기본 값으로 지정되며, 챕터의 기본 스타일이 없다면, 토픽의 기본 스타일 값이 사용됩니다.',
            )}
          </Description>
          <FormGroup>
            <FormLevelProperties
              fontSizes={TOPIC_FONT_SIZES}
              fontFamilies={TOPIC_FONT_FAMILIES}
              onChangeProperties={this.onChangeTopicProperties}
              properties={topicProperties}
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('페이지 전환 애니메이션')}</SubLabel>
          <Description>{t('페이지 전환 애니메이션')}</Description>
          <FormGroup>
            <Selector
              outline
              items={PAGE_TRANSFER_ANIMATION}
              value={settings.transferAnimation}
              onChange={(value) => {
                this.onChangeTopicSettings('transferAnimation', value);
              }}
              minWidth="140px"
            />
            <span className="transfer-animation-desc">
              {PAGE_TRANSFER_ANIMATION.find((d) => d.key === settings.transferAnimation).desc}
            </span>
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <div className="position-relative">
            <SubLabel>{t('label.topicAdmin')}</SubLabel>
            <Description>{t('message.topicUserDesc')}</Description>
          </div>
          <FormGroup className="flex-grow-1">
            <UserManager
              className="user-manager"
              onRemove={(id) => {
                const users = topic.users.splice(0);
                const index = users.findIndex((u) => u.id === id);
                users.splice(index, 1);
                this.setState({
                  topic: { ...topic, users },
                });
              }}
              users={topic.users}
              newCard="토픽 관리자 설정"
              onNewCard={() => {
                this.setOpenUserPopup(true);
              }}
            />
          </FormGroup>
          <BottomButton className="text-right mt-3" saveText={saveText} onSave={() => {}} onCancel={onCancel} />
        </Form>
        {openUserPopup && (
          <Popup title="토픽 관리자" open setOpen={this.setOpenUserPopup}>
            <UserSearchPopup
              users={topic.users}
              setOpen={this.setOpenUserPopup}
              selectedTitle="선택된 사용자"
              selectedUserMarkedTag="ADMIN"
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
  grps: [],
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
    info: PropTypes.shape({
      icon: PropTypes.shape({
        type: PropTypes.string,
        data: PropTypes.objectOf(PropTypes.any),
      }),
    }),
  }),
  grps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  onSave: PropTypes.func,
  saveText: PropTypes.string,
  onCancel: PropTypes.func,
  grpId: PropTypes.string,
};
