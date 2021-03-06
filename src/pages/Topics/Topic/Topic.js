import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { DetailLayout } from '@/layouts';
import { EmptyMessage } from '@/components';
import { TopicInfo } from '@/assets';
import { DEFAULT_TOPIC_CONTENT } from '@/assets/Topics/PageEditor/PageController/constants';
import { convertUsers } from '@/pages/Users/util';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import './Topic.scss';

class Topic extends Component {
  constructor(props) {
    super(props);

    const {
      match: {
        params: { topicId },
      },
    } = this.props;

    this.state = {
      topic: null,
      shares: null,
      isAdmin: null,
      topicId: Number(topicId),
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isAdmin === null && props.user && state.topic) {
      return {
        isAdmin: state.topic.users.findIndex((u) => u.id === props.user.id) > -1 || props.user.isAdmin,
      };
    }

    return null;
  }

  componentDidMount() {
    const { topicId } = this.state;
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
    const { topicId } = this.state;
    const { history } = this.props;

    history.push(`/topics/${topicId}/edit`);
  };

  render() {
    const { t } = this.props;
    const { topic, isAdmin, shares } = this.state;

    return (
      <div className="topic-wrapper">
        <div className="topic-menu">
          <div className='menu-item selected'>
            <div>토픽 정보</div>
          </div>
          <div className="separator">
            <div />
          </div>
          <div
            className="menu-item"
            onClick={() => {
              const { history } = this.props;
              const { topicId } = this.state;
              history.push(`/topics/${topicId}/shares`);
            }}
          >
            <div>공유 이력</div>
          </div>
          <div className="separator">
            <div />
          </div>
          <div className="menu-item" onClick={() => {
            const { history } = this.props;
            const { topicId } = this.state;
            history.push(`/topics/${topicId}/chapters`);
          }}>
            <div>컨텐츠</div>
          </div>
        </div>
        <div className="topic-content">
          <DetailLayout className="m-0 h-100">
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
              <TopicInfo
                topic={topic}
                shares={shares}
                onList={this.onList}
                onDelete={isAdmin ? this.onDelete : null}
                onEdit={isAdmin ? this.onEdit : null}
              />
            )}
          </DetailLayout>
        </div>
      </div>
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
    isAdmin: PropTypes.bool,
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
