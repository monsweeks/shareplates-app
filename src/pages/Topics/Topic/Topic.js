import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { DetailLayout, PageTitle } from '@/layouts';
import { Button, IconViewer, P, SubLabel, UserManager } from '@/components';
import './Topic.scss';

const breadcrumbs = [
  {
    name: '토픽',
    to: '/topics',
  },
  {
    name: '새 토픽',
    to: '/topics/new',
  },
];

class Topic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      users: [],
    };
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
      (data) => {
        console.log(data);
        this.setState({
          topic: data.topic,
          users: data.topicUsers,
        });
      },
      null,
      true,
    );
  };

  onChange = (field) => (value) => {
    const { topic } = this.state;

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
    const { t, history, addMessage: addMessageReducer } = this.props;

    if (topic.passwordConfirm !== topic.password) {
      addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('validation.badInput'), t('validation.notEqualPassword'));
      return;
    }

    request.post('/api/topics', topic, (data) => {
      history.push(data._links.topics.href);
    });
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { t, addMessage: addMessageReducer, organizations, history } = this.props;
    // eslint-disable-next-line no-unused-vars
    const { topic, existName, openUserPopup, users } = this.state;

    return (
      <DetailLayout className="topic-wrapper">
        {topic && (
          <>
            <PageTitle list={breadcrumbs}>{topic.name}</PageTitle>
            <hr className="d-none d-sm-block mb-3" />

            <SubLabel>{t('ORGANIZATION')}</SubLabel>
            <P upppercase value={topic.organization.name} />
            <hr className="g-dashed mb-3" />
            <SubLabel>{t('label.icon')}</SubLabel>
            <div>
              <div className="topic-image">
                <IconViewer iconIndex={topic.iconIndex} />
              </div>
            </div>
            <hr className="g-dashed mb-3" />
            <SubLabel>{t('label.name')}</SubLabel>
            <P upppercase value={topic.name} />
            <hr className="g-dashed mb-3" />
            <SubLabel>{t('label.desc')}</SubLabel>
            <P upppercase pre value={topic.summary} />
            <hr className="g-dashed mb-3" />
            <SubLabel>{t('label.privateTopic')}</SubLabel>
            <P upppercase value={topic.privateYn ? 'private' : 'public'} />
            <hr className="g-dashed mb-3" />
            <div className="position-relative">
              <SubLabel>{t('label.topicAdmin')}</SubLabel>
            </div>

            <UserManager
              emptyBackgroundColor="#F6F6F6"
              className="selected-user mt-3 mt-sm-0"
              lg={3}
              md={4}
              sm={6}
              xl={12}
              users={users}
            />

            <div>
              <Button
                className="px-4"
                color="primary"
                onClick={() => {
                  const {
                    match: {
                      params: { topicId },
                    },
                  } = this.props;

                  history.push(`/topics/${topicId}/edit`);
                }}
              >
                {t('button.edit')}
              </Button>
            </div>
          </>
        )}
      </DetailLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    organizations: state.user.organizations,
    organizationId: state.user.organizationId,
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
    info: PropTypes.string,
  }),
  t: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  addMessage: PropTypes.func,
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.number,
    }),
  }),
};
