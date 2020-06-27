import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, FlexOverflowSection, Popup, UserIcon } from '@/components';
import { ChatManager } from '@/assets';
import ShareStandByUserList from './ShareStandByUserList/ShareStandByUserList';

import { SCREEN_TYPE } from '@/constants/constants';
import { SharePropTypes } from '@/proptypes';
import './ShareStandByPopup.scss';

class ShareStandByPopup extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpenChatMessage: false,
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
      messages,
    } = this.props;

    const { isOpenChatMessage } = this.state;

    return (
      <Popup open full>
        <div className="share-stand-by-popup-wrapper">
          {screenType === SCREEN_TYPE.PROJECTOR && (
            <div className="projector">
              <div className="name">
                <div>
                  <span className="text">{share.name}</span>
                </div>
              </div>
              <div className="address">
                <div>
                  <div className="message">{t('공유 메뉴에서 아래 엑세스 코드를 입력하거나')}</div>
                  <div className="access-code-input">
                    <input type="text" value={accessCode.code} readOnly />
                  </div>
                  <div className="message or">{t('또는')}</div>
                  <div className="message">아래 URL을 통해 토픽에 참여할 수 있습니다.</div>
                  <div className="address-url">
                    <span>{window.location.href}</span>
                  </div>
                </div>
              </div>
              <div className="user-count">
                <div>
                  <span className="number">{users.length}</span>
                </div>
              </div>
              <div className="user-info">
                <div className="user-list">
                  <FlexOverflowSection overflowX>
                    <div className="user-icon-list">
                      <div>
                        {users &&
                          users.map((u) => {
                            return (
                              <div key={u.id}>
                                <div className="user-icon">{user && <UserIcon info={u.info} />}</div>
                                <div className="user-name">{u.name}</div>
                              </div>
                            );
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
              <div className="name">
                <div>
                  <span className="text">{share.name}</span>
                  <span className="chat-icon">
                    <Button
                      color="white"
                      onClick={() => {
                        this.setState({
                          isOpenChatMessage: !isOpenChatMessage,
                        });
                      }}
                    >
                      <i className="fal fa-comment-dots" />
                    </Button>
                  </span>
                </div>
              </div>
              <div className="share-ready-content">
                <div className="p-4 h5 mb-0">
                  {t('아직 토픽이 시작되지 않았습니다. 토픽 매니저가 공유를 시작할때까지 잠시 기다려주세요.')}
                </div>
                <div className="user-count">
                  <span>{users.length}</span>
                </div>
                <div className="user-info-list">
                  <FlexOverflowSection>
                    <ShareStandByUserList hideMessage users={users} user={user} />
                  </FlexOverflowSection>
                </div>
                <div className="admin-control">
                  <div>
                    <div>
                      <Button color="primary" onClick={exitShare}>
                        <i className="fal fa-sign-out-alt" />
                      </Button>
                      <div>
                        <span>나가기</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <>
                        <div>
                          <Button color="danger" className="stop" onClick={closeShare}>
                            <i className="fas fa-stop" />
                          </Button>
                          <div>
                            <span>종료</span>
                          </div>
                        </div>
                        <div>
                          <Button color="primary" className="start" onClick={startShare}>
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
            </div>
          )}
          {isOpenChatMessage && screenType === SCREEN_TYPE.WEB && (
            <div className="chat-list">
              <div>
                <ChatManager messages={messages} user={user} sendReadyChat={sendReadyChat} />
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
  messages: PropTypes.arrayOf(PropTypes.any),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareStandByPopup)));
