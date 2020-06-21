import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { DetailLayout, PageTitle } from '@/layouts';
import { EmptyMessage, Tabs } from '@/components';
import { ShareHistoryList, TopicInfo } from '@/assets';
import './Topic.scss';
import { DEFAULT_TOPIC_CONTENT } from '@/assets/Topics/PageEditor/PageController/constants';
import { convertUsers } from '@/pages/Users/util';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const tabs = [
  {
    value: 'topic-info',
    name: '토픽 정보',
  },
  {
    value: 'share-history',
    name: '공유 히스토리',
  },
];

class Topic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      shares: null,
      isAdmin: null,
      tab: 'share-history',
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
    this.getShares(topicId);
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

  getShares = (topicId) => {
    request.get(`/api/topics/${topicId}/shares`, null, (data) => {
      this.setState({
        shares: data.shares,
      });
    });
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
    const { topic, isAdmin, tab, shares } = this.state;

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
              className="mb-0"
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
            <Tabs
              left
              tabs={tabs}
              tab={tab}
              onChange={(v) => {
                this.setState({
                  tab: v,
                });
              }}
              buttonStyle
            />
            {tab === 'topic-info' && (
              <TopicInfo
                topic={topic}
                onList={this.onList}
                onDelete={isAdmin ? this.onDelete : null}
                onEdit={isAdmin ? this.onEdit : null}
              />
            )}
            {tab === 'share-history' && <ShareHistoryList shares={shares} onList={this.onList} />}
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
