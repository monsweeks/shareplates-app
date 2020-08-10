import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import FlipNumbers from 'react-flip-numbers';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, FlexOverflowSection, Popup, ShareCard, TopLogo, UserIcon } from '@/components';
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
      tab: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.tab && props.share) {
      return {
        tab: props.share.privateYn ? 'accessCode' : 'intro',
      };
    }

    return null;
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

    const { isOpenChatMessage, tab } = this.state;

    console.log(share);

    return (
      <Popup open full>
        <div className="share-stand-by-popup-wrapper">
          {screenType === SCREEN_TYPE.PROJECTOR && (
            <div className="projector">
              <div className="header">
                <TopLogo weatherEffect />
              </div>
              <div className="welcome-message"><div>참여자를 기다리고 있습니다</div></div>
              <div className="projector-info">
                <div>
                  <div className="projector-menu">
                    <div>
                      {!share.privateYn && <div onClick={() => {
                        this.setState({
                          tab : 'intro'
                        });
                      }} className={tab === 'intro' ? 'selected' : ''}>참여 방법{!share.privateYn ? '-1' : ''}</div>}
                      <div onClick={() => {
                        this.setState({
                          tab : 'accessCode'
                        });
                      }} className={tab === 'accessCode' ? 'selected' : ''}>참여 방법{!share.privateYn ? '-2' : ''}</div>
                      <div onClick={() => {
                        this.setState({
                          tab : 'users'
                        });
                      }} className={tab === 'users' ? 'selected' : ''}>참여자</div>
                    </div>
                  </div>
                  {(!share.privateYn && tab === 'intro') && (
                    <div className="projector-content">
                      <div className="core-info">
                        <div>
                          <ShareCard className="share-card" share={share} />
                        </div>
                      </div>
                      <div className="projector-desc">
                        <div className="title">
                          <div className="no">
                            <span>1</span>
                          </div>
                          <div className="text">
                            <span>SHAREPLATES 접속</span>
                          </div>
                        </div>
                        <div className="message mb-4">
                          <span>웹 브라우저를 통해 </span>
                          <span className="info url">{window.location.origin}</span>
                          <span>에 접속합니다.</span>
                        </div>
                        <div className="title">
                          <div className="no">
                            <span>2</span>
                          </div>
                          <div className="text">
                            <span>참여 버튼 클릭</span>
                          </div>
                        </div>
                        <div className="message">
                          <span>상단의 </span>
                          <span className="info">공유</span>
                          <span> 메뉴를 선택한 후, 목록에서 </span>
                          <span className="info">{share.name}</span>
                          <span>카드의 </span>
                          <span className="info">참여</span>
                          <span>버튼을 클릭합니다.</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {tab === 'accessCode' && (
                    <div className="projector-content">
                      <div className="core-info">
                        <div className="access-code"><div>{accessCode.code}</div></div>
                        <div className="access-code-tag">
                          <span>엑세스 코드</span>
                        </div>
                      </div>
                      <div className="projector-desc">
                        <div className="title">
                          <div className="no">
                            <span>1</span>
                          </div>
                          <div className="text">
                            <span>SHAREPLATES 접속</span>
                          </div>
                        </div>
                        <div className="message mb-4">
                          <span>웹 브라우저를 통해 </span>
                          <span className="info url">{window.location.origin}</span>
                          <span>에 접속합니다.</span>
                        </div>
                        <div className="title">
                          <div className="no">
                            <span>2</span>
                          </div>
                          <div className="text">
                            <span>엑세스 코드 입력</span>
                          </div>
                        </div>
                        <div className="message">
                          <span>상단의 </span>
                          <span className="info">공유</span>
                          <span> 메뉴를 선택한 후, 좌측 상단의 </span>
                          <span className="info">엑세스 코드로 참여</span>
                          <span>버튼을 클릭하고, 좌측의 엑세스 코드를 입력합니다.</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="step-content  d-none">
                <div className="step-row">
                  <div className="step-info">
                    <div />
                    <div className="bar" />
                    <div className="step-no g-attach-parent">
                      <div>
                        <span>1</span>
                      </div>
                    </div>
                    <div className="step-info-content g-attach-parent">
                      <div>참여방법 1</div>
                    </div>
                  </div>
                  <div className="step-content">
                    <div className="msg">
                      <span>{t('공유 메뉴에서 엑세스 코드를 입력하여 참여할 수 있습니다.')}</span>
                    </div>
                    <div className="access-code">
                      <span>ACCESS CODE</span>
                    </div>
                    <div className="code">{accessCode.code}</div>
                  </div>
                  <div className="step-info" />
                </div>

                <div className="step-row">
                  <div className="step-info">
                    <div />
                    <div className="bar" />
                    <div className="step-no g-attach-parent">
                      <div>
                        <span>2</span>
                      </div>
                    </div>
                    <div className="step-info-content g-attach-parent">
                      <div>참여방법 2</div>
                    </div>
                  </div>

                  <div className="step-content">
                    <div className="msg">
                      <span>
                        {t(
                          '브라우저에 아래 URL을 입력하여 참여할 수 있습니다. 실제 카드 정보 출력 버튼 클릭 | 엑세스 코드 | 주소 ',
                        )}
                      </span>
                    </div>
                    <div className="address">{window.location.href}</div>
                  </div>
                  <div className="step-info" />
                </div>
              </div>
              <div className="user-count d-none">
                <div>
                  <FlipNumbers height={50} width={200} play numbers={String(users.length)} />
                </div>
              </div>
              <div className="user-info  d-none">
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
