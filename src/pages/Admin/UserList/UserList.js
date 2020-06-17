import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { UserPropTypes } from '@/proptypes';
import './UserList.scss';
import request from '@/utils/request';
import { Table, UserIcon } from '@/components';
import { convertUsers } from '@/pages/Users/util';
import { PageTitle } from '@/layouts';

class UserList extends React.Component {
  init = false;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
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
    const { t } = this.props;
    const { users } = this.state;

    return (
      <div className="user-list-wrapper">
        <PageTitle className="m-0">
          {t('사용자 목록')}{' '}
          <span className="count">
            ({users.length}
            {t('명')})
          </span>
        </PageTitle>
        <div className="user-list-table scrollbar">
          <Table hover>
            <thead>
              <tr>
                <th className="id">{t('ID')}</th>
                <th className="icon">{t('아이콘')}</th>
                <th className="email">{t('이메일')}</th>
                <th className="name">{t('이름')}</th>
                <th className="datetime-format">{t('날짜 형식')}</th>
                <th className="language">{t('언어')}</th>
                <th className="registered">{t('등록')}</th>
                <th className="role-code">{t('권한')}</th>
                <th className="active-role-code">{t('권한(A)')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user.id}>
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
                    <td className="active-role-code">{user.activeRoleCode === 'SUPER_MAN' ? <i className="fad fa-medal" /> : ''}</td>
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
