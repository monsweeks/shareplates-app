import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerUserPopup.scss';
import { Col, Row } from '@/components';
import ShareUserCard from '@/pages/Shares/ContentViewer/Popups/ContentViewerUserPopup/ShareUserCard/ShareUserCard';

class ContentViewerUserPopup extends React.PureComponent {
  render() {
    const { users, user: currentUser, sendReadyChat, position } = this.props;
    const admins = users.filter((u) => u.shareRoleCode === 'ADMIN');
    const members = users.filter((u) => u.shareRoleCode !== 'ADMIN');
    const singleRow = position !== 'max';
    const currentUserIsAdmin = admins.findIndex((u) => u.id === currentUser.id) > -1;

    console.log(admins);
    console.log(currentUser);
    console.log(currentUserIsAdmin);

    return (
      <div className="content-viewer-user-popup-wrapper">
        <Row>
          {admins.map((user) => {
            return (
              <Col
                key={user.id}
                className="col m-0"
                xl={singleRow ? 12 : 3}
                lg={singleRow ? 12 : 4}
                md={singleRow ? 12 : 6}
                sm={singleRow ? 12 : 6}
                xs={12}
              >
                <ShareUserCard
                  className="user-card m-0"
                  currentUser={currentUser}
                  user={user}
                  sendReadyChat={sendReadyChat}
                  adminCard
                />
              </Col>
            );
          })}

          {members
            .filter((u) => u.id === currentUser.id)
            .map((user) => {
              return (
                <Col
                  key={user.id}
                  className="col m-0"
                  xl={singleRow ? 12 : 3}
                  lg={singleRow ? 12 : 4}
                  md={singleRow ? 12 : 6}
                  sm={singleRow ? 12 : 6}
                  xs={12}
                >
                  <ShareUserCard
                    key={user.id}
                    className="user-card m-0"
                    currentUser={currentUser}
                    user={user}
                    sendReadyChat={sendReadyChat}
                    userControl={currentUserIsAdmin}
                  />
                </Col>
              );
            })}

          {members
            .filter((u) => u.id !== currentUser.id)
            .map((user) => {
              return (
                <Col
                  key={user.id}
                  className="col m-0"
                  xl={singleRow ? 12 : 3}
                  lg={singleRow ? 12 : 4}
                  md={singleRow ? 12 : 6}
                  sm={singleRow ? 12 : 6}
                  xs={12}
                >
                  <ShareUserCard
                    key={user.id}
                    className="user-card m-0"
                    currentUser={currentUser}
                    user={user}
                    sendReadyChat={sendReadyChat}
                    userControl={currentUserIsAdmin}
                  />
                </Col>
              );
            })}
        </Row>
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
  position: PropTypes.string,
};

export default withRouter(withTranslation()(ContentViewerUserPopup));
