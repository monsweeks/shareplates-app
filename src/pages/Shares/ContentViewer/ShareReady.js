import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import './ShareReady.scss';
import { setConfirm } from '@/actions';
import { Button, ContentViewerUsers } from '@/components';

class ShareReady extends React.PureComponent {
  render() {
    const { isAdmin, users, startShare, closeShare, user, sendReadyChat } = this.props;

    return (
      <div className="share-prepare-content-wrapper">
        <div className="top">
          <div className="share-info">
            <div className="connect-url">
              <span>{window.location.href}</span>
            </div>
            <div className="connect-message">브라우저에 위 주소를 입력하여 토픽에 참여할 수 있습니다.</div>
            {!isAdmin && (
              <div className="user-message">
                <span>아직 관리자가 토픽을 시작하지 않았습니다</span>
              </div>
            )}
          </div>
          {isAdmin && (
            <div className="admin-control">
              <div>
                <Button onClick={closeShare}>
                  <i className="fas fa-stop" />
                </Button>
                <div>
                  <span>종료</span>
                </div>
              </div>
              <div>
                <Button className="start" onClick={startShare}>
                  <i className="fas fa-play" />
                </Button>
                <div>
                  <span>시작</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="user-count">
          <div className="line" />
          <span className="label">{users.length}명 접속중</span>
        </div>
        <ContentViewerUsers users={users} user={user} sendReadyChat={sendReadyChat} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
  };
};

ShareReady.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      info: PropTypes.string,
      shareRoleCode: PropTypes.string,
    }),
  ),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
    uuid: PropTypes.string,
  }),
  isAdmin: PropTypes.bool,
  startShare: PropTypes.func,
  closeShare: PropTypes.func,
  sendReadyChat: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ShareReady)));
