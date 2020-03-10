import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageTitle, RegisterLayout } from '@/layouts';
import { OrganizationForm } from '@/pages';
import { Description } from '@/components';

class EditOrganization extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      organization: null,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { organizationId },
      },
    } = this.props;

    this.getOrganization(organizationId);
  }

  getOrganization = (organizationId) => {
    request.get(
      `/api/organizations/${organizationId}`,
      null,
      (organization) => {
        console.log(organization);
        this.setState({
          organization,
        });
      },
      null,
      true,
    );
  };

  onSubmit = (organization) => {
    const { history } = this.props;

    request.post('/api/organizations', organization, (data) => {
      history.push(data._links.organizations.href);
    });
  };

  render() {
    const { t } = this.props;
    const { organization } = this.state;

    return (
      <RegisterLayout className="new-organization-wrapper">
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
        >
          {t('ORG 편집')}
        </PageTitle>
        <hr className="d-none d-sm-block mb-3" />
        <Description>
          {t(
            'SHAREPLATES에서 사용자들의 모임을 ORG라고 표현합니다. 동일한 관심사를 가진 사용자들이 모인 ORG를 만들어서, ORG에 포함된 토픽 컨텐츠를 공유할 수 있습니다.',
          )}
        </Description>
        <OrganizationForm edit saveText="label.makeTopic" onSave={this.onSubmit} organization={organization} />
      </RegisterLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(EditOrganization)));

EditOrganization.defaultProps = {
  t: null,
};

EditOrganization.propTypes = {
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
      organizationId: PropTypes.string,
    }),
  }),
};
