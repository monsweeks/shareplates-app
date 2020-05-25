import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageTitle, RegisterLayout } from '@/layouts';
import { TopicForm } from '@/assets';
import { EmptyMessage } from '@/components';
import { DEFAULT_TOPIC_CONTENT } from '@/assets/Topics/PageEditor/PageController/constants';
import { convertUsers, serializeUsers } from '@/pages/Users/util';

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
      (topic) => {
        const next = topic;
        if (next.content) {
          next.content = { ...JSON.parse(JSON.stringify(DEFAULT_TOPIC_CONTENT)), ...JSON.parse(next.content) };
        } else {
          next.content = JSON.parse(JSON.stringify(DEFAULT_TOPIC_CONTENT));
        }

        next.users = convertUsers(next.users);

        this.setState({
          topic : next
        });
      },
      null,
      true,
    );
  };

  onSubmit = (topic) => {
    const { history } = this.props;
    const next = {...topic};
    next.users = serializeUsers(next.users);
    request.put(`/api/topics/${next.id}`, next, () => {
      history.push(`/topics/${topic.id}`);
    });
  };

  render() {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;
    const { t, grps, user, history } = this.props;
    const { topic } = this.state;
    return (
      <RegisterLayout>
        {topic === false && (
          <EmptyMessage
            className="h5"
            message={
              <div>
                <div className="h1">
                  <i className="fal fa-exclamation-circle" />
                </div>
                <div>{t('message.notFoundTopic')}</div>
              </div>
            }
          />
        )}
        {topic && (
          <>
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
              border
            >
              {t('message.editTopic')}
            </PageTitle>
            <TopicForm
              edit
              saveText="button.save"
              topic={topic}
              user={user}
              grps={grps}
              onSave={this.onSubmit}
              onCancel={() => {
                history.push(`/topics/${topicId}`);
              }}
            />
          </>
        )}
      </RegisterLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    grps: state.user.grps,
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
  }),
  grps: PropTypes.arrayOf(
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
