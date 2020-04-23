import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerUsers.scss';
import { Avatar, Button, Card, CardBody, Col, EmptyMessage, Row } from '@/components';

class ContentViewerUsers extends React.Component {
  textarea = null;

  constructor(props) {
    super(props);
    this.textarea = React.createRef();
    this.state = {
      micOn: false,
      message: '',
    };
  }

  getUserCard = (info, isAdmin) => {
    const { micOn, message } = this.state;
    const { user: currentUser, sendReadyChat } = this.props;
    const isMe = info.id === currentUser.id;

    return (
      <div className={`user-card ${info.status !== 'ONLINE' ? 'OFFLINE' : ''}`}>
        {isAdmin && (
          <div className="crown-icon">
            <span>
              <i className="fas fa-crown" />
            </span>
          </div>
        )}
        <div className="user-info">
          <div className="user-icon">
            <div>
              {info.info && <Avatar data={JSON.parse(info.info)} />}
              {!info.info && <span className="default-icon" />}
            </div>
          </div>
          <div className="user-name">
            <span>{info.name}</span>
          </div>
        </div>
        <div className="chat">
          {((!micOn && isMe) || !isMe) && (
            <div
              className="last-chat"
              onDoubleClick={() => {
                if (isMe) {
                  this.setState(
                    {
                      micOn: !micOn,
                    },
                    () => {
                      if (!micOn) {
                        setTimeout(() => {
                          this.textarea.current.focus();
                        }, 100);
                      }
                    },
                  );
                }
              }}
            >
              <div className="message scrollbar">{info.message}</div>
            </div>
          )}
          {micOn && isMe && (
            <div className="last-chat">
              <div className="last-chat-input">
                <textarea
                  className="scrollbar"
                  ref={this.textarea}
                  cols={3}
                  onChange={(e) => {
                    this.setState({ message: e.target.value });
                  }}
                  value={message}
                />
              </div>
            </div>
          )}
          {info.status !== 'ONLINE' && (
            <span className="status">
              <span>OFFLINE</span>
            </span>
          )}
          {isMe && (
            <div className="chat-button">
              {!micOn && (
                <Button
                  className="mic-icon"
                  size="xs"
                  onClick={() => {
                    this.setState(
                      {
                        micOn: !micOn,
                      },
                      () => {
                        if (!micOn) {
                          setTimeout(() => {
                            this.textarea.current.focus();
                          }, 100);
                        }
                      },
                    );
                  }}
                >
                  메세지
                </Button>
              )}
              {micOn && (
                <Button
                  size="xs"
                  onClick={() => {
                    this.setState(
                      {
                        micOn: !micOn,
                      },
                      () => {
                        if (!micOn) {
                          setTimeout(() => {
                            this.textarea.current.focus();
                          }, 100);
                        }
                      },
                    );
                  }}
                >
                  취소
                </Button>
              )}
              {micOn && (
                <Button
                  className="ml-1"
                  size="xs"
                  color="primary"
                  onClick={() => {
                    sendReadyChat(message);
                    this.setState({
                      micOn: false,
                      message: '',
                    });
                  }}
                >
                  전송
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { users, t, className } = this.props;
    const members = users.filter((user) => user.shareRoleCode === 'MEMBER');

    return (
      <div className={`${className} content-viewer-user-wrapper`}>
        <div className="admin-user">
          {users
            .filter((user) => user.shareRoleCode === 'ADMIN')
            .map((user) => {
              return (
                <Card key={user.id} className="border-0">
                  <CardBody className="p-0">{this.getUserCard(user, true)}</CardBody>
                </Card>
              );
            })}
        </div>
        {members.length > 0 && (
          <div className="member-user scrollbar">
            <div>
              <Row>
                {users
                  .filter((user) => user.shareRoleCode === 'MEMBER')
                  .map((user) => {
                    return (
                      <Col className="col" xl={3} lg={4} md={6} sm={6} xs={12} key={user.id}>
                        <Card className="border-0">
                          <CardBody className="p-0">{this.getUserCard(user, false)}</CardBody>
                        </Card>
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

ContentViewerUsers.defaultProps = {
  className: '',
};

ContentViewerUsers.propTypes = {
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

export default withRouter(withTranslation()(ContentViewerUsers));
