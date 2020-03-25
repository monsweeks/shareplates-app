import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageTitle, RegisterLayout } from '@/layouts';
import { OrganizationForm } from '@/pages';
import { PageIntro } from '@/components';

class NewOrganization extends React.PureComponent {
  onSubmit = (organization) => {
    const { history } = this.props;

    request.post('/api/organizations', organization, (data) => {
      history.push(data._links.organizations.href);
    });
  };

  onCancel = () => {
    const { history } = this.props;
    history.push('/organizations');
  };

  render() {
    const { t, user } = this.props;
    return (
      <RegisterLayout>
        <PageTitle
          list={[
            {
              name: t('label.organizationList'),
              to: '/organizations',
            },
            {
              name: t('label.newOrg'),
              to: '/organizations/new',
            },
          ]}
          border
        >
          {t('label.makeOrg')}
        </PageTitle>
        <PageIntro>
          {t(
            'SHAREPLATES에서 사용자들의 모임을 ORG라고 표현합니다. 동일한 관심사를 가진 사용자들이 모인 ORG를 만들어서, ORG에 포함된 토픽 컨텐츠를 공유할 수 있습니다.',
          )}
        </PageIntro>
        <OrganizationForm saveText="label.makeOrg" onSave={this.onSubmit} user={user} onCancel={this.onCancel} />
      </RegisterLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(NewOrganization)));

NewOrganization.defaultProps = {
  t: null,
};

NewOrganization.propTypes = {
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
};
