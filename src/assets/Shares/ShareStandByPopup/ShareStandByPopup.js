import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import FlipNumbers from 'react-flip-numbers';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, FlexOverflowSection, Popup, RadioButton, ShareCard, TopLogo, UserIcon } from '@/components';
import { ChatManager } from '@/assets';
import { Header } from '@/layouts';
import { SCREEN_TYPE } from '@/constants/constants';
import { SharePropTypes } from '@/proptypes';
import './ShareStandByPopup.scss';
import { VIEW_TYPES } from '../../../constants/constants';

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
        tab: 'intro',
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

    return (
      <Popup open full>
        <div className="share-stand-by-popup-wrapper">
          {screenType === SCREEN_TYPE.PROJECTOR && (
            <div className="share-stand-content">
              <div className="header">
                <div className="stand-menu g-no-select left-menu">
                  <div>
                    <div
                      onClick={() => {
                        this.setState({
                          tab: 'intro',
                        });
                      }}
                      className={tab === 'intro' ? 'selected' : ''}
                    >
                      참여 방법
                      <div className="arrow">
                        <div />
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        this.setState({
                          tab: 'users',
                        });
                      }}
                      className={tab === 'users' ? 'selected' : ''}
                    >
                      참여자
                      <div className="arrow">
                        <div />
                      </div>
                    </div>
                  </div>
                </div>
                <TopLogo weatherEffect={false} />
                <div className="stand-menu g-no-select">
                  <div className="text-right">
                    <div
                      onClick={() => {
                        this.setState({
                          tab: 'manage',
                        });
                      }}
                      className={tab === 'manage' ? 'selected' : ''}
                    >
                      관리
                      <div className="arrow">
                        <div />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {tab === 'intro' && (
                <div className="standby-content">
                  <div>
                    <div className="info-row address-row">
                      <div className="text">웹 브라우저를 통해 아래 URL에 접속해주세요.</div>
                      <div>
                        <span className="address">
                          {window.location.origin === 'http://localhost:3000'
                            ? 'http://www.shareplates.com'
                            : window.location.origin}
                        </span>
                      </div>
                    </div>
                    <div className="info-row method-1">
                      <div className="tag">
                        <span className="">토픽 참여 방법 {!share.privateYn && '#1'}</span>
                      </div>
                      <div className="text mb-3">
                        웹 사이트 좌측 상단의 &apos;공유&lsquo; 메뉴를 클릭하고, 엑세스 코드로 참여 버튼을 클릭합니다.
                      </div>
                      <div className="display-header mb-3">
                        <Header forDisplay />
                        <div className="view-type">
                          <RadioButton items={VIEW_TYPES} value="accessCode" onClick={this.onChangeViewType} />
                          <div className="circle-pointer" />
                        </div>
                      </div>
                      <div className="text">아래 엑세스 코드를 입력하여 참여할 수 있습니다.</div>
                      <div className="access-code">{accessCode.code}</div>
                    </div>
                    {!share.privateYn && (
                      <div className="or-row">
                        <div className="line" />
                        <div className="or">OR</div>
                      </div>
                    )}
                    {!share.privateYn && (
                      <div className="info-row method-2">
                        <div className="tag">
                          <span className="">토픽 참여 방법 #2</span>
                        </div>
                        <div className="text mb-3">
                          웹 사이트 좌측 상단의 &apos;공유&lsquo; 메뉴를 클릭하여, 현재 공유 중인 목록을 확인합니다.
                        </div>
                        <div className="display-header mb-3">
                          <Header forDisplay />
                          <div className="circle-pointer" />
                        </div>
                        <div className="text mb-3">
                          조회된 목록에서 아래 형태의 카드의 &apos;참여&lsquo; 버튼을 클릭하여, 참여할 수 있습니다.
                        </div>
                        <div className="display-card">
                          <div>
                            <ShareCard className="share-card" share={share} />
                            <div className="circle-pointer" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {tab === 'users' && (
                <div className="standby-content">
                  <div>
                    <div className="user-count">
                      <div>
                        <FlipNumbers height={65} width={200} play numbers={String(users.length)} />
                        <div className="tag">
                          <span className="">참여중</span>
                        </div>
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
                </div>
              )}
              {tab === 'manage' && isAdmin && (
                <div className="standby-content">
                  <div className="manage">
                    <div>
                      <Button color="white" onClick={startShare}>
                        시작하기
                      </Button>
                    </div>
                  </div>
                  <div className="share-close-button">
                    <span>
                      <Button color="white" onClick={closeShare}>
                        종료하기
                      </Button>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          {screenType === SCREEN_TYPE.WEB && (
            <div className="share-stand-content">
              <div className="header">
                <div className="stand-menu g-no-select" />
                <TopLogo weatherEffect={false} />
                <div className="stand-menu g-no-select">
                  <div className="text-right">
                    <div onClick={exitShare}>
                      나가기
                      <div className="arrow">
                        <div />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="standby-content">
                <div>
                  <div
                    className="web-user-counter"
                    onClick={() => {
                      this.setState({
                        isOpenChatMessage: !isOpenChatMessage,
                      });
                    }}
                  >
                    <span className="counter-icon">
                      <i className="fal fa-user-astronaut" />
                    </span>
                    <span className="counter">
                      <FlipNumbers height={20} width={40} play numbers={String(users.length)} />
                    </span>
                    <span className="counter-icon arrow-icon">
                      {isOpenChatMessage && <i className="fal fa-chevron-up" />}
                      {!isOpenChatMessage && <i className="fal fa-chevron-down" />}
                    </span>
                  </div>
                  <div className="web-info">
                    <div className="ready-message">
                      <div className="align-self-center w-100">
                        <div className="text text-center h2 pt-5">{share.name}</div>
                        <div className="text text-center h5">
                          {t('아직 토픽이 시작되지 않았습니다. 토픽 매니저가 공유를 시작할때까지 잠시 기다려주세요.')}
                        </div>
                      </div>
                    </div>
                    {isOpenChatMessage && screenType === SCREEN_TYPE.WEB && (
                      <div className="separator">
                        <div />
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
  messages: PropTypes.arrayOf(PropTypes.any),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareStandByPopup)));
