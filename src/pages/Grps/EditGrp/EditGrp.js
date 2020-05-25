import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { PageTitle, RegisterLayout } from '@/layouts';
import { GrpForm } from '@/assets';
import { convertUsers, serializeUsers } from '@/pages/Users/util';

class EditGrp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      grp: null,
    };
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
        const next = grp;
        next.admins = convertUsers(grp.admins);
        next.members = convertUsers(grp.members);

        this.setState({
          grp: next,
        });
      },
      null,
      true,
    );
  };

  onSubmit = (grp) => {
    const { history } = this.props;

    const next = {...grp};
    next.admins = serializeUsers(next.admins);
    next.members = serializeUsers(next.members);

    request.put(`/api/groups/${grp.id}`, grp, () => {
      history.push(`/groups/${grp.id}`);
    });
  };

  onCancel = () => {
    const { history } = this.props;
    const { grp } = this.state;
    history.push(`/groups/${grp.id}`);
  };

  render() {
    const { t } = this.props;
    const { grp } = this.state;

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
          {t('그룹 편집')}
        </PageTitle>
        <GrpForm edit saveText="button.save" onSave={this.onSubmit} onCancel={this.onCancel} grp={grp} />
      </RegisterLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(EditGrp)));

EditGrp.defaultProps = {
  t: null,
};

EditGrp.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
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
};
