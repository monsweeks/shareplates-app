import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageTitle, RegisterLayout } from '@/layouts';
import { TopicForm } from '@/assets';
import { PageIntro } from '@/components';
import common from '@/utils/common';

class NewTopic extends React.PureComponent {
  onSubmit = (topic) => {
    const { history } = this.props;

    request.post('/api/topics', topic, (data) => {
      history.push(`/topics/${data.id}`);
    });
  };

  onCancel = () => {
    const { history } = this.props;
    history.push('/topics');
  };

  render() {
    const {
      t,
      grps,
      user,
      location: { search },
    } = this.props;
    const options = common.getOptions(search, ['grpId']);

    return (
      <RegisterLayout>
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
          border
        >
          {t('message.makeNewTopic')}
        </PageTitle>
        <PageIntro>{t('토픽에 대한 설명')}</PageIntro>
        <TopicForm
          saveText="label.makeTopic"
          onSave={this.onSubmit}
          user={user}
          grps={grps}
          grpId={options.grpId}
          onCancel={this.onCancel}
        />
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
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
};
