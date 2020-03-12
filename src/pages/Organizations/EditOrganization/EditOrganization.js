import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageTitle, RegisterLayout } from '@/layouts';
import { OrganizationForm } from '@/pages';

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

    request.put(`/api/organizations/${organization.organizationId}`, organization, (data) => {
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
        <OrganizationForm edit saveText="label.saveOrg" onSave={this.onSubmit} organization={organization} />
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
