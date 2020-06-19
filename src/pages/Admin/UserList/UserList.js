import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { UserPropTypes } from '@/proptypes';
import request from '@/utils/request';
import { Table, UserIcon } from '@/components';
import { convertUsers } from '@/pages/Users/util';
import { PageTitle } from '@/layouts';
import './UserList.scss';

class UserList extends React.Component {
  init = false;

  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      users: [],
      breadcrumbs: [
        {
          name: t('label.breadcrumbs.systemManagement'),
          to: '/admin',
        },
        {
          name: t('label.breadcrumbs.userList'),
          to: '/admin/users',
        },
      ],
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (!this.init && user && user.isAdmin) {
      this.init = true;
      this.getUsers();
    }
  }

  componentDidUpdate() {
    const { user } = this.props;
    if (!this.init && user && user.isAdmin) {
      this.init = true;
      this.getUsers();
    }
  }

  getUsers = () => {
    request.get('/api/users', null, (data) => {
      this.setState({
        users: convertUsers(data.userList),
      });
    });
  };

  render() {
    const { t, history } = this.props;
    const { users, breadcrumbs } = this.state;

    return (
      <div className="user-list-wrapper">
        <PageTitle className="m-0" list={breadcrumbs}>
          {t('label.userList')}{' '}
          <span className="count">
            ({users.length}
            {t('label.personCount')})
          </span>
        </PageTitle>
        <div className="user-list-table scrollbar">
          <Table className="g-sticky" hover>
            <thead>
              <tr>
                <th className="id">{t('label.id')}</th>
                <th className="icon">{t('label.icon')}</th>
                <th className="email">{t('label.email')}</th>
                <th className="name">{t('label.name')}</th>
                <th className="datetime-format">{t('label.dateFormat')}</th>
                <th className="language">{t('label.language')}</th>
                <th className="registered">{t('label.registration')}</th>
                <th className="role-code">{t('label.role')}</th>
                <th className="active-role-code">{t('label.appliedRole')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr
                    key={user.id}
                    onClick={() => {
                      history.push(`/admin/users/${user.id}`);
                    }}
                  >
                    <td className="id">{user.id}</td>
                    <td className="icon">
                      <span className="user-icon">
                        <UserIcon info={user.info} />
                      </span>
                    </td>
                    <td className="email">{user.email}</td>
                    <td className="name">{user.name}</td>
                    <td className="datetime-format">{user.dateTimeFormat}</td>
                    <td className="language">{user.language}</td>
                    <td className="registered">{user.registered ? 'Y' : 'N'}</td>
                    <td className="role-code">{user.roleCode === 'SUPER_MAN' ? <i className="fad fa-medal" /> : ''}</td>
                    <td className="active-role-code">
                      {user.activeRoleCode === 'SUPER_MAN' ? <i className="fad fa-medal" /> : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

UserList.propTypes = {
  user: UserPropTypes,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(UserList)));
