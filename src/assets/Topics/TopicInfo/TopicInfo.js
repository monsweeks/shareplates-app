import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { BottomButton, Description, DetailValue, SubLabel } from '@/components';
import { UserManager } from '@/assets';
import {
  PAGE_TRANSFER_ANIMATION,
  TOPIC_FONT_FAMILIES,
  TOPIC_FONT_SIZES,
} from '@/assets/Topics/PageEditor/PageController/constants';
import { TopicPropTypes } from '@/proptypes';
import './TopicInfo.scss';

class TopicInfo extends React.PureComponent {
  render() {
    const { t, topic } = this.props;
    const { onList, onDelete, onEdit } = this.props;

    return (
      <>
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
                {topic.content.topicProperties.backgroundColor ? topic.content.topicProperties.backgroundColor : '-'}
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
        <BottomButton className="text-right mt-3" onList={onList} onDelete={onDelete} onEdit={onEdit} />
      </>
    );
  }
}

export default withRouter(withTranslation()(TopicInfo));

TopicInfo.defaultProps = {
  t: null,
};

TopicInfo.propTypes = {
  t: PropTypes.func,
  topic: TopicPropTypes,
  onList: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};
