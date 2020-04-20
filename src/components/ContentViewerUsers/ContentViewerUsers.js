import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerUsers.scss';
import { Avatar, EmptyMessage } from '@/components';

class ContentViewerUsers extends React.PureComponent {
  render() {
    const { users, t } = this.props;

    console.log(users);

    return (
      <div className="user-list-wrapper">
        <div className="admin-user">
          {users
            .filter((user) => user.shareRoleCode === 'ADMIN')
            .map((user) => {
              return (
                <div className="user-card">
                  <div className='crown-icon'>
                    <i className="fas fa-crown"/>
                  </div>
                  <div className="user-icon">
                    <div>
                      {user.info && <Avatar data={JSON.parse(user.info)} />}
                      {!user.info && (
                        <span>
                          <i className="fal fa-smile" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="user-name">{user.name}</div>
                </div>
              );
            })}
        </div>
        {users && users.length > 0 && (
          <ul>
            {users
              .filter((user) => user.shareRoleCode === 'MEMBER')
              .map((user) => {
                return (
                  <li key={user.id}>
                    <div className="user-icon">
                      {user.info && <Avatar data={JSON.parse(user.info)} />}
                      {!user.info && (
                        <span>
                          <i className="fal fa-smile" />
                        </span>
                      )}
                    </div>
                    <div>{user.name}</div>
                  </li>
                );
              })}
          </ul>
        )}
        {!(users && users.length > 0) && (
          <EmptyMessage
            className="h5"
            message={
              <div>
                <div>{t('현재 참여 중인 사용자가 없습니다')}</div>
              </div>
            }
          />
        )}
      </div>
    );
  }
}

ContentViewerUsers.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      info: PropTypes.string,
      shareRoleCode: PropTypes.string,
    }),
  ),
  t: PropTypes.func,
};

export default withRouter(withTranslation()(ContentViewerUsers));
