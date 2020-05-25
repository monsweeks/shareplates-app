import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageTitle, RegisterLayout } from '@/layouts';
import { PageIntro } from '@/components';
import { GrpForm } from '@/assets';
import { serializeUsers } from '@/pages/Users/util';

class NewGrp extends React.PureComponent {
  onSubmit = (grp) => {
    const { history } = this.props;

    const next = {...grp};
    next.admins = serializeUsers(next.admins);
    next.members = serializeUsers(next.members);

    request.post('/api/groups', grp, () => {
      history.push('/groups');
    });
  };

  onCancel = () => {
    const { history } = this.props;
    history.push('/groups');
  };

  render() {
    const { t, user } = this.props;
    return (
      <RegisterLayout>
        <PageTitle
          list={[
            {
              name: t('label.grpList'),
              to: '/groups',
            },
            {
              name: t('label.newGrp'),
              to: '/groups/new',
            },
          ]}
          border
        >
          {t('label.makeGrp')}
        </PageTitle>
        <PageIntro>
          {t(
            'SHAREPLATES에서 사용자들의 모임을 그룹라고 표현합니다. 동일한 관심사를 가진 사용자들이 모인 그룹을 만들어서, 그룹에 포함된 토픽 컨텐츠를 공유할 수 있습니다.',
          )}
        </PageIntro>
        <GrpForm saveText="label.makeGrp" onSave={this.onSubmit} user={user} onCancel={this.onCancel} />
      </RegisterLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(NewGrp)));

NewGrp.defaultProps = {
  t: null,
};

NewGrp.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  t: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
