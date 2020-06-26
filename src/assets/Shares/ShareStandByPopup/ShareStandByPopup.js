import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, FlexOverflowSection, Popup, TextArea, UserIcon } from '@/components';
import ShareStandByUserList from './ShareStandByUserList/ShareStandByUserList';

import { SCREEN_TYPE } from '@/constants/constants';
import { SharePropTypes } from '@/proptypes';
import './ShareStandByPopup.scss';

class ShareStandByPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  render() {
    const {
      share,
      isAdmin,
      users,
      startShare,
      closeShare,
      user,
      sendReadyChat,
      exitShare,
      screenType,
      accessCode,
      t,
    } = this.props;

    const { message } = this.state;

    return (
      <Popup open full>
        <div className="share-stand-by-popup-wrapper">
          {screenType === SCREEN_TYPE.PROJECTOR && (
            <div className="projector">
              <div className="title">
                <div>
                  <span>{share.name}</span>
                </div>
              </div>
              <div className="address">
                <div>
                  <div className="message">{t('공유 메뉴에서 아래 엑세스 코드를 입력하거나')}</div>
                  <div className="access-code-input">
                    <input type="text" value={accessCode.code} />
                  </div>
                  <div className="message or">{t('또는')}</div>
                  <div className="message">아래 URL을 통해 토픽에 참여할 수 있습니다.</div>
                  <div className="address-url">
                    <span>{window.location.href}</span>
                  </div>
                </div>
              </div>
              <div className="user-info">
                <div className="user-count">
                  <div>
                    <span className="number">{users.length}</span>
                    <div className="mt-1">참여</div>
                  </div>
                </div>
                <div className="user-list">
                  <FlexOverflowSection overflowX>
                    <div className="user-icon-list">
                      <div>
                        {users &&
                          users.map((u) => {
                            return <div className="user-icon">{user && <UserIcon info={u.info} />}</div>;
                          })}
                      </div>
                    </div>
                  </FlexOverflowSection>
                </div>
              </div>
            </div>
          )}
          {screenType === SCREEN_TYPE.WEB && (
            <div className="web">
              <div className="title">
                <div>
                  <span>{share.name}</span>
                </div>
              </div>
              <div className="share-status">
                <span>{t('토픽이 아직 시작되지 않았습니다.')}</span>
              </div>
              <div className="share-ready-content">
                <div className="user-info-list">
                  <FlexOverflowSection>
                    <ShareStandByUserList users={users} user={user} />
                  </FlexOverflowSection>
                </div>
                <div className="chat-list">
                  <div className="title">
                    <div>{t('메세지')}</div>
                  </div>
                  <div className="chat-content">&nbsp;</div>
                  <div className="chat-control">
                    <div className="input-control">
                      <TextArea
                        height="50px"
                        className="p-0"
                        onChange={(value) => {
                          this.setState({
                            message: value,
                          });
                        }}
                        value={message}
                      />
                    </div>
                    <div className="button-control">
                      <Button
                        color="primary"
                        onClick={() => {
                          sendReadyChat(message);
                          this.setState({
                            message: '',
                          });
                        }}
                      >
                        {t('전송')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-control">
                <div>
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
            </div>
          )}
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
  t: PropTypes.func,
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
  screenType: PropTypes.string,
  share: SharePropTypes,
  accessCode: PropTypes.shape({
    code: PropTypes.string,
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareStandByPopup)));
