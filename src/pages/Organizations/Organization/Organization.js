import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setConfirm } from 'actions';
import request from '@/utils/request';
import { DetailLayout, PageContent, PageTitle, SubContentBox } from '@/layouts';
import { Col, EmptyMessage, P, Row, SubLabel, SubTitle, UserManager } from '@/components';

class Organization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      organization: null,
      isAdmin: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isAdmin === null && props.user && state.organization) {
      return {
        isAdmin: state.organization.admins.findIndex((u) => u.id === props.user.id) > -1,
      };
    }

    return null;
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

  deleteOrganization = (organizationId) => {
    const { history } = this.props;
    request.del(
      `/api/organizations/${organizationId}`,
      null,
      () => {
        history.push('/organizations');
      },
      null,
      true,
    );
  };

  onDelete = () => {
    const { organization } = this.state;
    const { setConfirm: setConfirmReducer } = this.props;
    setConfirmReducer(`${organization.name} 토픽을 정말 삭제하시겠습니까?`, () => {
      this.deleteOrganization(organization.id);
    });
  };

  onList = () => {
    const { history } = this.props;
    history.push('/organizations');
  };

  onEdit = () => {
    const { organization } = this.state;
    const { history } = this.props;

    history.push(`/organizations/${organization.id}/edit`);
  };

  render() {
    const {
      match: {
        params: { organizationId },
      },
    } = this.props;
    const { t } = this.props;
    const { organization, isAdmin } = this.state;

    return (
      <DetailLayout margin={false}>
        {!organization && organization === false  && (
          <EmptyMessage
            className="h5 bg-white"
            message={
              <div>
                <div className="h1">
                  <i className="fal fa-exclamation-circle" />
                </div>
                <div>{t('message.notFoundResource')}</div>
              </div>
            }
          />
        )}
        {organization && (
          <>
            <PageTitle
              className=""
              list={[
                {
                  name: t('label.organizationList'),
                  to: '/organizations',
                },
                {
                  name: organization && organization.name,
                  to: `/organizations/${organizationId}`,
                },
              ]}
              onDelete={isAdmin ? this.onDelete : null}
              onList={this.onList}
              onEdit={isAdmin ? this.onEdit : null}
              marginBottom={false}
            >
              {t('ORG 정보')}
            </PageTitle>
            <PageContent>
              <Row className="flex-grow-1">
                <Col lg={4} className="d-flex flex-column flex-grow-1 pr-3 pr-lg-2">
                  <SubContentBox className="flex-grow-1">
                    <SubTitle className="flex-grow-0">{t('GENERAL INFO')}</SubTitle>
                    <SubLabel>{t('label.name')}</SubLabel>
                    <P upppercase className="mb-3">
                      {organization.name}
                    </P>
                    <SubLabel>{t('label.desc')}</SubLabel>
                    <P upppercase pre>
                      {organization.description}
                    </P>
                  </SubContentBox>
                </Col>
                <Col lg={8} className="d-flex flex-column flex-grow-1">
                  <SubContentBox className="flex-grow-1 mb-3">
                    <SubTitle className="flex-grow-0">{t('어드민')}</SubTitle>
                    <UserManager
                      className="h-auto pb-0"
                      lg={3}
                      md={4}
                      sm={6}
                      xl={12}
                      users={organization.admins}
                      border
                    />
                  </SubContentBox>
                  <SubContentBox className="flex-grow-1 mt-2">
                    <SubTitle className="flex-grow-0">{t('label.organizationMember')}</SubTitle>
                    <UserManager
                      className="h-auto pb-0"
                      lg={3}
                      md={4}
                      sm={6}
                      xl={12}
                      users={organization.members}
                      border
                    />
                  </SubContentBox>
                </Col>
              </Row>
            </PageContent>
          </>
        )}
      </DetailLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Organization)));

Organization.defaultProps = {
  t: null,
};

Organization.propTypes = {
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
  setConfirm: PropTypes.func,
};
