import React from 'react';
import PropTypes from 'prop-types';
import ShareStandByUserCard from './ShareStandByUserCard/ShareStandByUserCard';
import './ShareStandByUserList.scss';

class ShareStandByUserList extends React.PureComponent {
  render() {
    const { className, users, hideMessage } = this.props;

    return (
      <div className={`${className} share-stand-by-user-list-wrapper`}>
        {users.length > 0 && (
          <div className="user-list">
            <div>
              {users
                .filter((u) => u.shareRoleCode === 'ADMIN')
                .map((user) => {
                  return (
                    <ShareStandByUserCard
                      key={user.id}
                      hideMessage={hideMessage}
                      user={user}
                      message={user.message}
                      isAdmin
                    />
                  );
                })}
              {users
                .filter((u) => u.shareRoleCode === 'MEMBER')
                .map((user) => {
                  return (
                    <ShareStandByUserCard key={user.id} hideMessage={hideMessage} user={user} message={user.message} />
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

ShareStandByUserList.defaultProps = {
  className: '',
};

ShareStandByUserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      shareRoleCode: PropTypes.string,
      message: PropTypes.string,
    }),
  ),
  className: PropTypes.string,
  hideMessage: PropTypes.bool,
};

export default ShareStandByUserList;
