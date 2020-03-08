import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageTitle, RegisterLayout } from '@/layouts';
import { TopicForm } from '@/pages';

class EditTopic extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      topic: null,
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
        const { topic } = data;
        topic.users = data.topicUsers;
        delete topic.topicUser;

        this.setState({
          topic,
        });
      },
      null,
      true,
    );
  };

  onSubmit = (topic) => {
    const { history } = this.props;
    console.log(topic);
    request.put(`/api/topics/${topic.id}`, topic, (data) => {
      history.push(data._links.topics.href);
    });
  };

  render() {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;
    const { t, organizations, user, history } = this.props;
    const { topic } = this.state;
    return (
      <RegisterLayout className="new-topic-wrapper">
        <PageTitle
          list={[
            {
              name: t('label.topicList'),
              to: '/topics',
            },
            {
              name: topic && topic.name,
              to: `/topics/${topicId}`,
            },
            {
              name: t('label.edit'),
              to: `/topics/${topicId}/edit`,
            },
          ]}
        >
          {t('message.editTopic')}
        </PageTitle>
        <hr className="d-none d-sm-block mb-3" />
        <TopicForm
          edit
          saveText="button.edit"
          topic={topic}
          user={user}
          organizations={organizations}
          onSave={this.onSubmit}
          onCancel={() => {
            history.push(`/topics/${topicId}`);
          }}
        />
      </RegisterLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    organizations: state.user.organizations,
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(EditTopic)));

EditTopic.defaultProps = {
  t: null,
};

EditTopic.propTypes = {
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
