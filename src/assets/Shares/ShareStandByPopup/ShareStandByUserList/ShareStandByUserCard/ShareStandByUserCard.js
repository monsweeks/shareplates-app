import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Avatar, Button, Card, CardBody } from '@/components';
import './ShareStandByUserCard.scss';

class ShareStandByUserCard extends React.Component {
  textarea = null;

  constructor(props) {
    super(props);
    this.textarea = React.createRef();
    this.state = {
      micOn: false,
      message: '',
    };
  }

  render() {
    const { micOn, message } = this.state;
    const { currentUser, user, className, isAdmin, sendReadyChat } = this.props;
    const isMe = user.id === currentUser.id;

    return (
      <Card key={user.id} className={`user-card-wrapper ${className} border-0`}>
        <CardBody className="p-0">
          <div className={`user-card-content ${user.status !== 'ONLINE' ? 'OFFLINE' : ''}`}>
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
                  {user.info && <Avatar data={JSON.parse(user.info)} />}
                  {!user.info && <span className="default-icon" />}
                </div>
              </div>
              <div className="user-name">
                <span>{user.name}</span>
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
                  <div className="message scrollbar">{user.message}</div>
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
              {user.status !== 'ONLINE' && (
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
        </CardBody>
      </Card>
    );
  }
}

ShareStandByUserCard.defaultProps = {
  className: '',
};

ShareStandByUserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
    status: PropTypes.string,
    message: PropTypes.string,
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),
  isAdmin: PropTypes.bool,
  className: PropTypes.string,
  sendReadyChat: PropTypes.func,
};

export default withRouter(withTranslation()(ShareStandByUserCard));
