import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageContent, PageTitle, RegisterLayout } from '@/layouts';
import { TopicForm } from '@/pages';

class NewTopic extends React.PureComponent {
  onSubmit = (topic) => {
    const { history } = this.props;

    request.post('/api/topics', topic, (data) => {
      history.push(data._links.topics.href);
    });
  };

  render() {
    const { t, organizations, user } = this.props;
    return (
      <RegisterLayout className="new-topic-wrapper">
        <PageTitle
          list={[
            {
              name: t('label.topicList'),
              to: '/topics',
            },
            {
              name: t('label.newTopic'),
              to: '/topics/new',
            },
          ]}
          marginBottom={false}
          border
        >
          {t('message.makeNewTopic')}
        </PageTitle>
        <PageContent>
          <TopicForm saveText="label.makeTopic" onSave={this.onSubmit} user={user} organizations={organizations} />
        </PageContent>
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

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(NewTopic)));

NewTopic.defaultProps = {
  t: null,
};

NewTopic.propTypes = {
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
};
