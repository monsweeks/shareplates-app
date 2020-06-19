import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { DetailLayout, PageTitle } from '@/layouts';
import { BottomButton, Description, DetailValue, EmptyMessage, SubLabel } from '@/components';
import { UserManager } from '@/assets';
import './Topic.scss';
import {
  DEFAULT_TOPIC_CONTENT,
  PAGE_TRANSFER_ANIMATION,
  TOPIC_FONT_FAMILIES,
  TOPIC_FONT_SIZES,
} from '@/assets/Topics/PageEditor/PageController/constants';
import { convertUsers } from '@/pages/Users/util';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';

class Topic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      isAdmin: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isAdmin === null && props.user && state.topic) {
      return {
        isAdmin: state.topic.users.findIndex((u) => u.id === props.user.id) > -1,
      };
    }

    return null;
  }

  componentDidMount() {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;

    this.getTopic(topicId);
  }

  getTopic = (topicId) => {
    request.get(
      `/api/topics/${topicId}`,
      null,
      (topic) => {
        const next = { ...topic };
        if (next.content) {
          next.content = { ...JSON.parse(JSON.stringify(DEFAULT_TOPIC_CONTENT)), ...JSON.parse(next.content) };
        } else {
          next.content = JSON.parse(JSON.stringify(DEFAULT_TOPIC_CONTENT));
        }

        next.users = convertUsers(next.users);

        this.setState({
          topic: next,
        });
      },
      null,
      true,
    );
  };

  deleteTopic = (topicId) => {
    const { history } = this.props;
    request.del(
      `/api/topics/${topicId}`,
      null,
      () => {
        history.push('/topics');
      },
      null,
      true,
    );
  };

  onDelete = () => {
    const { topic } = this.state;
    dialog.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      '데이터가 삭제됩니다',
      `${topic.name} 토픽을 정말 삭제하시겠습니까?`,
      () => {
        this.deleteTopic(topic.id);
      },
    );
  };

  onList = () => {
    const { history } = this.props;
    history.push('/topics');
  };

  onEdit = () => {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;
    const { history } = this.props;

    history.push(`/topics/${topicId}/edit`);
  };

  render() {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;
    const { t } = this.props;
    const { topic, isAdmin } = this.state;

    return (
      <DetailLayout className="topic-wrapper" margin={false}>
        {!topic && topic === false && (
          <EmptyMessage
            className="h5 bg-white"
            message={
              <div>
                <div className="h1">
                  <i className="fal fa-exclamation-circle" />
                </div>
                <div>{t('message.notFoundResource')}</div>
              </div>
            }
          />
        )}
        {topic && (
          <>
            <PageTitle
              className=""
              list={[
                {
                  name: t('label.topicList'),
                  to: '/topics',
                },
                {
                  name: topic && topic.name,
                  to: `/topics/${topicId}`,
                },
              ]}
              border
            >
              {t('토픽 정보')}
            </PageTitle>
            <SubLabel>{t('그룹')}</SubLabel>
            <Description>{t('message.selectGrpForTopic')}</Description>
            <DetailValue upppercase>{topic.grpName}</DetailValue>
            <SubLabel>{t('label.name')}</SubLabel>
            <Description>{t('message.topicNameDesc')}</Description>
            <DetailValue>{topic.name}</DetailValue>
            <SubLabel>{t('label.desc')}</SubLabel>
            <Description>{t('message.topicDescDesc')}</Description>
            <DetailValue pre>{topic.summary}</DetailValue>
            <SubLabel>{t('label.privateTopic')}</SubLabel>
            <Description>{t('message.privateTopicDesc')}</Description>
            <DetailValue upppercase>{topic.privateYn ? 'private' : 'public'}</DetailValue>
            <SubLabel>{t('토픽 기본 스타일')}</SubLabel>
            <Description>
              {t(
                '토픽의 컨텐츠에 지정할 기본적인 스타일 정보를 선택합니다. 기본 스타일은 토픽, 챕터, 페이지 각각의 스타일을 지정할 수 있으며, 페이지에 지정된 스타일이 업다면, 챕터의 스타일이 기본 값으로 지정되며, 챕터의 기본 스타일이 없다면, 토픽의 기본 스타일 값이 사용됩니다.',
              )}
            </Description>
            <div className="topic-properties-info">
              <div className="topic-properties-preview">
                <div
                  style={{
                    padding: topic.content.topicProperties.padding,
                  }}
                >
                  <div
                    style={{
                      fontFamily: topic.content.topicProperties.fontFamily,
                      fontSize: topic.content.topicProperties.fontSize,
                      backgroundColor: topic.content.topicProperties.backgroundColor,
                      color: topic.content.topicProperties.color,
                    }}
                  >
                    <div>CONTENT</div>
                  </div>
                </div>
              </div>
              <div className="topic-properties-values">
                <div className="font-family">
                  <div className="label">
                    <span>{t('폰트 종류')}</span>
                  </div>
                  <div className="value">
                    {topic.content.topicProperties.fontFamily
                      ? TOPIC_FONT_FAMILIES.find((d) => d.value === topic.content.topicProperties.fontFamily).name
                      : '-'}
                  </div>
                </div>
                <div className="font-size">
                  <div className="label">
                    <span>{t('폰트 크기')}</span>
                  </div>
                  <div className="value">
                    {topic.content.topicProperties.fontSize
                      ? TOPIC_FONT_SIZES.find((d) => d.value === topic.content.topicProperties.fontSize).name
                      : '-'}
                  </div>
                </div>
                <div className="color">
                  <div className="label">
                    <span>{t('폰트 색상')}</span>
                  </div>
                  <div className="value">
                    {topic.content.topicProperties.color ? topic.content.topicProperties.color : '-'}
                  </div>
                </div>
                <div className="background-color">
                  <div className="label">
                    <span>{t('배경 색상')}</span>
                  </div>
                  <div className="value">
                    {topic.content.topicProperties.backgroundColor
                      ? topic.content.topicProperties.backgroundColor
                      : '-'}
                  </div>
                </div>
                <div className="padding">
                  <div className="label">
                    <span>{t('페이지 여백')}</span>
                  </div>
                  <div className="value">
                    {topic.content.topicProperties.padding ? topic.content.topicProperties.padding : '-'}
                  </div>
                </div>
              </div>
            </div>
            <SubLabel>{t('페이지 전환 애니메이션')}</SubLabel>
            <Description>{t('페이지 전환 애니메이션')}</Description>
            <DetailValue>
              {topic.content.settings.transferAnimation && (
                <>
                  <span className="mr-1">
                    {PAGE_TRANSFER_ANIMATION.find((d) => d.key === topic.content.settings.transferAnimation).value}
                  </span>
                  -
                  <span className="ml-1">
                    {PAGE_TRANSFER_ANIMATION.find((d) => d.key === topic.content.settings.transferAnimation).desc}
                  </span>
                </>
              )}
              {!topic.content.settings.transferAnimation && <span>-</span>}
            </DetailValue>
            <SubLabel>{t('label.topicAdmin')}</SubLabel>
            <Description>{t('message.topicUserDesc')}</Description>
            <UserManager className="pt-2 px-2" users={topic.users} />
            <BottomButton
              className="text-right mt-3"
              onList={this.onList}
              onDelete={isAdmin ? this.onDelete : null}
              onEdit={isAdmin ? this.onEdit : null}
            />
          </>
        )}
      </DetailLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(Topic)));

Topic.defaultProps = {
  t: null,
};

Topic.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  t: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
    }),
  }),
};
