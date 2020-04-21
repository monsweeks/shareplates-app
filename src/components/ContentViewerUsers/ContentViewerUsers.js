import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerUsers.scss';
import { Avatar, EmptyMessage } from '@/components';

class ContentViewerUsers extends React.PureComponent {
  getUserCard = (user, isAdmin) => {
    return (
      <div key={user.id} className="user-card">
        {isAdmin && (
          <div className="crown-icon">
            <i className="fas fa-crown" />
          </div>
        )}

        <div className="user-icon">
          <div>
            {user.info && <Avatar data={JSON.parse(user.info)} />}
            {!user.info && (
              <span className="default-icon">
                <i className="fal fa-smile" />
              </span>
            )}
          </div>
        </div>
        <div className="user-name">
          <span>{user.name}</span>
        </div>
      </div>
    );
  };

  render() {
    const { users, t, className } = this.props;

    return (
      <div className={`${className} user-list-wrapper`}>
        <div className="admin-user">
          {users
            .filter((user) => user.shareRoleCode === 'ADMIN')
            .map((user) => {
              return this.getUserCard(user, true);
            })}
        </div>
        {users && users.length > 0 && (
          <div className="member-user scrollbar">
            {users
              .filter((user) => user.shareRoleCode === 'MEMBER')
              .map((user) => {
                return this.getUserCard(user, false);
              })}
          </div>
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

ContentViewerUsers.defaultProps = {
  className: '',
};

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
  className: PropTypes.string,
};

export default withRouter(withTranslation()(ContentViewerUsers));
