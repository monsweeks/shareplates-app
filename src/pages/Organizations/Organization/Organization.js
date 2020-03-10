import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setConfirm } from 'actions';
import request from '@/utils/request';
import { DetailLayout, PageTitle } from '@/layouts';
import { BottomButton, DateTime, EmptyMessage, P, SubLabel, UserManager } from '@/components';
import './Organization.scss';

class Organization extends Component {
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

  render() {
    const {
      match: {
        params: { organizationId },
      },
    } = this.props;
    const { t, history, setConfirm: setConfirmReducer } = this.props;
    const { organization } = this.state;

    return (
      <DetailLayout className="organization-wrapper">
        {organization === false && (
          <EmptyMessage
            className="h5"
            message={
              <div>
                <div className="h1">
                  <i className="fal fa-exclamation-circle" />
                </div>
                <div>{t('message.notFoundOrganization')}</div>
              </div>
            }
          />
        )}
        {organization && (
          <>
            <PageTitle
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
            >
              {organization.name}
            </PageTitle>
            <hr className="d-none d-sm-block mb-3" />
            <div className="flex-grow-1">
              <SubLabel>{t('label.name')}</SubLabel>
              <P className="bg-white" upppercase value={organization.name} />
              <SubLabel>{t('label.desc')}</SubLabel>
              <P className="bg-white" upppercase pre value={organization.description} />
              <div className="position-relative mb-3">
                <SubLabel>{t('label.organizationAdmin')}</SubLabel>
              </div>
              <div>
                <UserManager
                  emptyBackgroundColor="#F6F6F6"
                  className="selected-user mt-3 mt-sm-1"
                  lg={3}
                  md={4}
                  sm={6}
                  xl={12}
                  users={organization.admins}
                />
              </div>
              <div className="position-relative mb-3">
                <SubLabel>{t('label.organizationAdmin')}</SubLabel>
              </div>
              <div>
                <UserManager
                  emptyBackgroundColor="#F6F6F6"
                  className="selected-user mt-3 mt-sm-1"
                  lg={3}
                  md={4}
                  sm={6}
                  xl={12}
                  users={organization.members}
                />
              </div>
              <SubLabel>{t('label.creationDate')}</SubLabel>
              <P className="bg-white" value={<DateTime value={organization.creationDate} />} />
              <SubLabel>{t('label.updateDate')}</SubLabel>
              <P className="bg-white" value={<DateTime value={organization.lastUpdateDate} />} />
            </div>
            <BottomButton
              onDelete={() => {
                setConfirmReducer(`${organization.name} 토픽을 정말 삭제하시겠습니까?`, () => {
                  this.deleteOrganization(organization.id);
                });
              }}
              onList={() => {
                history.push('/organizations');
              }}
              onEdit={() => {
                history.push(`/organizations/${organizationId}/edit`);
              }}
            />
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
