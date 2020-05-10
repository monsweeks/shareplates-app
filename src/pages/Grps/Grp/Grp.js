import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setConfirm } from 'actions';
import request from '@/utils/request';
import { DetailLayout, PageTitle } from '@/layouts';
import { EmptyMessage, P, SubLabel } from '@/components';
import { UserManager } from '@/assets';

class Grp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grp: null,
      isAdmin: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isAdmin === null && props.user && state.grp) {
      return {
        isAdmin: state.grp.admins.findIndex((u) => u.id === props.user.id) > -1,
      };
    }

    return null;
  }

  componentDidMount() {
    const {
      match: {
        params: { grpId },
      },
    } = this.props;

    this.getGrp(grpId);
  }

  getGrp = (grpId) => {
    request.get(
      `/api/groups/${grpId}`,
      null,
      (grp) => {
        this.setState({
          grp,
        });
      },
      null,
      true,
    );
  };

  deleteGrp = (grpId) => {
    const { history } = this.props;
    request.del(
      `/api/groups/${grpId}`,
      null,
      () => {
        history.push('/groups');
      },
      null,
      true,
    );
  };

  onDelete = () => {
    const { grp } = this.state;
    const { setConfirm: setConfirmReducer } = this.props;
    setConfirmReducer(`${grp.name} 그룹을 정말 삭제하시겠습니까?`, () => {
      this.deleteGrp(grp.id);
    });
  };

  onList = () => {
    const { history } = this.props;
    history.push('/groups');
  };

  onEdit = () => {
    const { grp } = this.state;
    const { history } = this.props;

    history.push(`/groups/${grp.id}/edit`);
  };

  render() {
    const {
      match: {
        params: { grpId },
      },
    } = this.props;
    const { t } = this.props;
    const { grp, isAdmin } = this.state;

    return (
      <DetailLayout margin={false}>
        {!grp && grp === false && (
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
        {grp && (
          <>
            <PageTitle
              className=""
              list={[
                {
                  name: t('label.grpList'),
                  to: '/groups',
                },
                {
                  name: grp && grp.name,
                  to: `/groups/${grpId}`,
                },
              ]}
              onDelete={isAdmin ? this.onDelete : null}
              onList={this.onList}
              onEdit={isAdmin ? this.onEdit : null}
              border
            >
              {t('그룹 정보')}
            </PageTitle>
            <SubLabel>{t('label.name')}</SubLabel>
            <P upppercase className="mb-3">
              {grp.name}
            </P>
            <SubLabel>{t('label.desc')}</SubLabel>
            <P upppercase pre>
              {grp.description}
            </P>
            <SubLabel>{t('어드민')}</SubLabel>
            <UserManager className="h-auto bg-light" lg={3} md={4} sm={6} xl={12} users={grp.admins} border />
            <SubLabel>{t('label.grpMember')}</SubLabel>
            <UserManager className="h-auto bg-light" lg={3} md={4} sm={6} xl={12} users={grp.members} border />
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

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Grp)));

Grp.defaultProps = {
  t: null,
};

Grp.propTypes = {
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
      grpId: PropTypes.string,
    }),
  }),
  setConfirm: PropTypes.func,
};
