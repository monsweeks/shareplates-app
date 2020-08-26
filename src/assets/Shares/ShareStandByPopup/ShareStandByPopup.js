import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import FlipNumbers from 'react-flip-numbers';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, FlexOverflowSection, Popup, RadioButton, ShareCard, TopLogo, UserIcon } from '@/components';
import { ChatManager } from '@/assets';
import ShareStandByUserList from './ShareStandByUserList/ShareStandByUserList';
import { Header } from '@/layouts';
import { SCREEN_TYPE } from '@/constants/constants';
import { SharePropTypes } from '@/proptypes';
import './ShareStandByPopup.scss';

const viewTypes = [
  {
    key: 'accessCode',
    value: '엑세스 코드로 참여',
    icon: <i className="fal fa-code" />,
  },
  {
    key: 'list',
    value: '공개 토픽 리스트',
    icon: <i className="fal fa-list" />,
  },
];

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
            <div className="projector">
              <div className="header">
                <div className="projector-menu g-no-select">
                  <div className="text-left">
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
                <div className="projector-menu g-no-select">
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
                <div className="projector-info">
                  <div>
                    <div className="info-row address-row">
                      <div className="tag">
                        <span className="">접속 URL</span>
                      </div>
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
                          <RadioButton items={viewTypes} value="accessCode" onClick={this.onChangeViewType} />
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
                <div className="projector-info">
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
              {tab === 'manage' && (
                <div className="projector-info">
                  <div className="manage">
                    <div>
                      <Button color='white' onClick={startShare}>
                        시작하기
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
