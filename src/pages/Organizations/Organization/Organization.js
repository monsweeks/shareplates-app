import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setConfirm } from 'actions';
import request from '@/utils/request';
import { DetailLayout, PageTitle } from '@/layouts';
import { BottomButton, DateTime, EmptyMessage, P, SubLabel, UserManager, SubTitle, ObjectImage } from '@/components';

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

  render() {
    const {
      match: {
        params: { organizationId },
      },
    } = this.props;
    const { t, history, setConfirm: setConfirmReducer } = this.props;
    const { organization, isAdmin } = this.state;

    const list = [];
    for (let i = 0; i < 30 * 35; i += 1) {
      list.push(i);
    }

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
              <SubTitle>{t('GENERAL INFO')}</SubTitle>
              {list.map((i) => {
                return <ObjectImage size='md' key={i} index={i} />;
              })}
              <SubLabel>{t('label.name')}</SubLabel>
              <P className="bg-white" upppercase>
                {organization.name}
              </P>
              <SubLabel>{t('label.desc')}</SubLabel>
              <P className="bg-white" upppercase pre>
                {organization.description}
              </P>
              <hr className="g-dashed mb-3" />
              <SubTitle>{t('USERS')}</SubTitle>
              <div className="position-relative mb-3">
                <SubLabel>{t('label.organizationAdmin')}</SubLabel>
              </div>
              <div>
                <UserManager lg={3} md={4} sm={6} xl={12} users={organization.admins} />
              </div>
              <div className="position-relative mb-3">
                <SubLabel>{t('label.organizationMember')}</SubLabel>
              </div>
              <div>
                <UserManager lg={3} md={4} sm={6} xl={12} users={organization.members} />
              </div>
            </div>
            <div className="flex-grow-0 text-right small">
              <DateTime value={organization.creationDate} /> 생성
            </div>
            {isAdmin && (
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
            )}
            {!isAdmin && (
              <BottomButton
                onList={() => {
                  history.push('/organizations');
                }}
              />
            )}
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
