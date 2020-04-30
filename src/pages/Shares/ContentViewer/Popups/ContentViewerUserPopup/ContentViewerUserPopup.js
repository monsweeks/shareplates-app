import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerUserPopup.scss';
import { Button, Col, EmptyMessage, Row } from '@/components';
import ShareUserCard from '@/pages/Shares/ContentViewer/Popups/ContentViewerUserPopup/ShareUserCard/ShareUserCard';

class ContentViewerUserPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'MEMBERS',
    };
  }

  render() {
    const { users, user: currentUser, position } = this.props;
    const { banUser, kickOutUser, allowUser } = this.props;
    const { type } = this.state;

    const admins = users.filter((u) => !u.banYn).filter((u) => u.shareRoleCode === 'ADMIN');
    const members =
      type === 'MEMBERS'
        ? users.filter((u) => !u.banYn).filter((u) => u.shareRoleCode !== 'ADMIN')
        : users.filter((u) => u.banYn).filter((u) => u.shareRoleCode !== 'ADMIN');
    const singleRow = position !== 'max';
    const currentUserIsAdmin = admins.findIndex((u) => u.id === currentUser.id) > -1;

    return (
      <div className={`content-viewer-user-popup-wrapper ${singleRow ? 'single-row' : 'multi-row'}`}>
        <div className="filter-buttons">
          <Button
            className={type === 'MEMBERS' ? 'selected' : ''}
            color="white"
            onClick={() => {
              this.setState({
                type: 'MEMBERS',
              });
            }}
          >
            MEMBERS
          </Button>
          <Button
            className={type === 'BANS' ? 'selected' : ''}
            color="white"
            onClick={() => {
              this.setState({
                type: 'BANS',
              });
            }}
          >
            BAN USERS
          </Button>
        </div>
        <div className="content-popup-content scrollbar">
          {members.length > 0 && (
            <Row>
              {type !== 'BANS' &&
                admins.map((user) => {
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
                        adminCard
                        border={!singleRow}
                        banUser={banUser}
                        allowUser={allowUser}
                        kickOutUser={kickOutUser}
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
                        userControl={currentUserIsAdmin}
                        border={!singleRow}
                        banUser={banUser}
                        allowUser={allowUser}
                        kickOutUser={kickOutUser}
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
                        userControl={currentUserIsAdmin}
                        border={!singleRow}
                        banUser={banUser}
                        allowUser={allowUser}
                        kickOutUser={kickOutUser}
                      />
                    </Col>
                  );
                })}
            </Row>
          )}
          {members.length < 1 && (
            <EmptyMessage
              className="h5 no-ban-users"
              message={
                <div>
                  <div className="h1">
                    <i className="fal fa-exclamation-circle" />
                  </div>
                  <div>제한된 사용자가 없습니다</div>
                </div>
              }
            />
          )}
        </div>
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
  position: PropTypes.string,
  banUser: PropTypes.func,
  allowUser: PropTypes.func,
  kickOutUser: PropTypes.func,
};

export default withRouter(withTranslation()(ContentViewerUserPopup));
