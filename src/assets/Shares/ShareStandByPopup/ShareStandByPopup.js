import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, Popup } from '@/components';
import ShareStandByUserList from './ShareStandByUserList/ShareStandByUserList';
import './ShareStandByPopup.scss';

class ShareStandByPopup extends React.PureComponent {
  render() {
    const { isAdmin, users, startShare, closeShare, user, sendReadyChat, exitShare, screenType } = this.props;

    console.log(screenType);

    return (
      <Popup open>
        <div className="share-stand-by-popup-wrapper">
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

            <div className="admin-control">
              <div>
                <Button onClick={exitShare}>
                  <i className="fal fa-sign-out-alt" />
                </Button>
                <div>
                  <span>나가기</span>
                </div>
              </div>
              {isAdmin && (
                <>
                  <div>
                    <Button className="stop" onClick={closeShare}>
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
                </>
              )}
            </div>
          </div>
          <div className="user-count">
            <span>{users.length}명 접속중</span>
          </div>
          <ShareStandByUserList users={users} user={user} sendReadyChat={sendReadyChat} />
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

ShareStandByPopup.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      name: PropTypes.string,
      shareRoleCode: PropTypes.string,
    }),
  ),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  isAdmin: PropTypes.bool,
  startShare: PropTypes.func,
  closeShare: PropTypes.func,
  sendReadyChat: PropTypes.func,
  exitShare: PropTypes.func,
  screenType : PropTypes.string,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareStandByPopup)));
