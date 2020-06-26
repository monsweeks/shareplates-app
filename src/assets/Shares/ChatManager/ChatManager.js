import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, DateTime, FlexOverflowSection, TextArea, UserIcon } from '@/components';
import './ChatManager.scss';

class ChatManager extends React.Component {
  scroller = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  componentDidMount() {
    this.adjustScroll();
  }

  componentDidUpdate(prevProps) {
    const { messages } = this.props;
    if (prevProps.messages && prevProps.messages.length < messages.length) {
      this.adjustScroll();
    }
  }

  adjustScroll = () => {
    if (this.scroller.current) {
      this.scroller.current.scrollTop = this.scroller.current.children[0].clientHeight;
    }
  };

  render() {
    const { user, sendReadyChat, t, messages } = this.props;

    const { message } = this.state;

    return (
      <div className="chat-manager-wrapper">
        <div className="title">
          <div>{t('메세지')}</div>
        </div>
        <div className="chat-content">
          <FlexOverflowSection
            onRef={
              /* eslint-disable-next-line no-return-assign */
              (ref) => (this.scroller = ref)
            }
            overflowY
          >
            <div>
              {messages.map((m, i) => {
                return (
                  <div key={i} className={`chat-item ${user.id === m.user.id ? 'my-message' : ''}`}>
                    <div className="user-icon">
                      <UserIcon info={m.user.info} />
                    </div>
                    <div className="message">
                      <div className="user-name">{m.user.name}</div>
                      <div className="message-content">
                        <span>{m.message}</span>
                      </div>
                      <div className="creation-date">
                        <DateTime value={m.creationDate} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </FlexOverflowSection>
        </div>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

ChatManager.propTypes = {
  t: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  sendReadyChat: PropTypes.func,
  messages: PropTypes.arrayOf(PropTypes.any),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ChatManager)));
