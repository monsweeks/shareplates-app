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
import { serializeUsers } from '@/pages/Users/util';

class NewTopic extends React.PureComponent {
  onSubmit = (topic) => {
    const { history } = this.props;

    const next = {...topic};
    next.users = serializeUsers(next.users);

    request.post(`/api/groups//${next.grpId}/topics`, next, (data) => {
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
        <PageIntro>{t('토픽은 어떤 강의나 주제 등을 의미하는 단위로 사용되며, 컨텐츠를 담는 가장 큰 단위입니다. 토픽은 챕터로 구성되며, 챕터는 페이지로 구성됩니다. 지금 토픽을 만들고, 컨텐츠를 설계해보세요.')}</PageIntro>
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
