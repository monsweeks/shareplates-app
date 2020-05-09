import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Col, EmptyMessage, Row } from '@/components';
import ShareStandByUserCard from './ShareStandByUserCard/ShareStandByUserCard';
import './ShareStandByUserList.scss';

class ShareStandByUserList extends React.PureComponent {
  render() {
    const { user: currentUser, t, className, users } = this.props;
    const members = users.filter((u) => u.shareRoleCode === 'MEMBER');
    const { sendReadyChat } = this.props;

    return (
      <div className={`${className} content-viewer-user-wrapper`}>
        <div className="admin-user">
          {users
            .filter((u) => u.shareRoleCode === 'ADMIN')
            .map((user) => {
              return (
                <ShareStandByUserCard
                  key={user.id}
                  currentUser={currentUser}
                  user={user}
                  sendReadyChat={sendReadyChat}
                  isAdmin
                />
              );
            })}
        </div>
        {members.length > 0 && (
          <div className="member-user scrollbar">
            <div>
              <Row>
                {members.map((user) => {
                  return (
                    <Col className="col" xl={3} lg={4} md={6} sm={6} xs={12} key={user.id}>
                      <ShareStandByUserCard
                        key={user.id}
                        currentUser={currentUser}
                        user={user}
                        sendReadyChat={sendReadyChat}
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
        )}
        {members.length < 1 && (
          <div className="member-empty">
            <EmptyMessage
              className="h5"
              message={
                <div>
                  <div>{t('참여 중인 사용자가 없습니다.')}</div>
                </div>
              }
            />
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
      info: PropTypes.string,
      shareRoleCode: PropTypes.string,
      message: PropTypes.string,
    }),
  ),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),
  t: PropTypes.func,
  className: PropTypes.string,
  sendReadyChat: PropTypes.func,
};

export default withRouter(withTranslation()(ShareStandByUserList));
