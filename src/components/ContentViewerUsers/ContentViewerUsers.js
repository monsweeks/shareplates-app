import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerUsers.scss';
import { Avatar, EmptyMessage } from '@/components';

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
      <div key={info.id} className="user-card">
        {isMe && (
          <div
            className="mic-icon"
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
            <i className="fal fa-microphone-alt" />
          </div>
        )}
        <div className="user-icon">
          <div>
            {info.info && <Avatar data={JSON.parse(info.info)} />}
            {!info.info && (
              <span className="default-icon">
                <i className="fal fa-smile" />
              </span>
            )}
          </div>
        </div>
        {info.status !== 'ONLINE' && <span className='status'><span>OFFLINE</span></span>}
        <div className="user-name">
          <span>
            {info.name}
            {isAdmin && (
              <div className="crown-icon">
                <i className="fas fa-crown" />
              </div>
            )}
          </span>
        </div>
        {((isMe && !micOn && info.message) || (!isMe && info.message)) && (
          <div className="last-chat">
            <div className="message scrollbar">{info.message}</div>
            <div className="arrow">
              <span />
            </div>
          </div>
        )}
        {micOn && isMe && (
          <div className="last-chat-input">
            <div className="message">
              <textarea
                ref={this.textarea}
                cols={3}
                onChange={(e) => {
                  this.setState({ message: e.target.value });
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendReadyChat(message);
                    this.setState({
                      micOn: false,
                      message: '',
                    });
                  }
                }}
                value={message}
              />
            </div>
            <div className="arrow">
              <span />
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { users, t, className } = this.props;

    return (
      <div className={`${className} user-list-wrapper`}>
        <div className="admin-user">
          {users
            .filter((user) => user.shareRoleCode === 'ADMIN')
            .map((user) => {
              return this.getUserCard(user, true);
            })}
        </div>
        {users && users.length > 0 && (
          <div className="member-user scrollbar">
            {users
              .filter((user) => user.shareRoleCode === 'MEMBER')
              .map((user) => {
                return this.getUserCard(user, false);
              })}
          </div>
        )}
        {!(users && users.length > 0) && (
          <EmptyMessage
            className="h5"
            message={
              <div>
                <div>{t('현재 참여 중인 사용자가 없습니다')}</div>
              </div>
            }
          />
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
