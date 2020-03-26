import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setConfirm } from 'actions';
import request from '@/utils/request';
import { DetailLayout, PageTitle } from '@/layouts';
import { EmptyMessage, IconViewer, P, SubLabel, UserManager } from '@/components';
import './Topic.scss';

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
        this.setState({
          topic,
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
      (data) => {
        history.push(data._links.topics.href);
      },
      null,
      true,
    );
  };

  onDelete = () => {
    const { topic } = this.state;
    const { setConfirm: setConfirmReducer } = this.props;

    setConfirmReducer(`${topic.name} 토픽을 정말 삭제하시겠습니까?`, () => {
      this.deleteTopic(topic.id);
    });
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
              onDelete={isAdmin ? this.onDelete : null}
              onList={this.onList}
              onEdit={isAdmin ? this.onEdit : null}
              border
            >
              {t('토픽 정보')}
            </PageTitle>
            <SubLabel>{t('label.icon')}</SubLabel>
            <div className="text-center py-4 bg-light mb-3 rounded">
              <div className="topic-image m-2 m-lg-0">
                <IconViewer iconIndex={topic.iconIndex} />
              </div>
            </div>
            <SubLabel>{t('label.name')}</SubLabel>
            <P>{topic.name}</P>
            <SubLabel>{t('ORG')}</SubLabel>
            <P upppercase>{topic.organizationName}</P>
            <SubLabel>{t('label.desc')}</SubLabel>
            <P pre>{topic.summary}</P>
            <SubLabel>{t('label.privateTopic')}</SubLabel>
            <P upppercase>{topic.privateYn ? 'private' : 'public'}</P>
            <SubLabel>{t('label.topicAdmin')}</SubLabel>
            <UserManager className="bg-light" lg={3} md={4} sm={6} xl={12} users={topic.users} blockStyle />
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

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Topic)));

Topic.defaultProps = {
  t: null,
};

Topic.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
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
  setConfirm: PropTypes.func,
};
