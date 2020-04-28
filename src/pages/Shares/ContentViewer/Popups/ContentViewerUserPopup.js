import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerUserPopup.scss';
import ContentUserCard from '@/pages/Shares/ContentViewer/ContentUserCard/ContentUserCard';

class ContentViewerUserPopup extends React.PureComponent {
  render() {
    const { users, user: currentUser, sendReadyChat } = this.props;
    const members = users.filter((u) => u.shareRoleCode === 'MEMBER');

    return (
      <div className="user-popup-wrapper">
        <div>
          <i className="fal fa-window-maximize"/>
          <i className="fal fa-window-minimize"/>
          <i className="fal fa-thumbtack"/>
          <i className="fal fa-times"/>
        </div>
        {users
          .filter((u) => u.shareRoleCode === 'ADMIN')
          .map((user) => {
            return (
              <ContentUserCard
                key={user.id}
                className="user-card"
                currentUser={currentUser}
                user={user}
                sendReadyChat={sendReadyChat}
                isAdmin
              />
            );
          })}
        {members.length > 0 && (
          <div className="member-user scrollbar">
            {members
              .filter((u) => u.shareRoleCode === 'MEMBER')
              .map((user) => {
                return (
                  <ContentUserCard
                    key={user.id}
                    className="user-card"
                    currentUser={currentUser}
                    user={user}
                    sendReadyChat={sendReadyChat}
                  />
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

ContentViewerUserPopup.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ),
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  sendReadyChat: PropTypes.func,
};

export default withRouter(withTranslation()(ContentViewerUserPopup));
