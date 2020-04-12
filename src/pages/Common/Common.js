import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { addMessage, clearMessage, setConfirm, setUserAndGrp } from 'actions';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Button, Logo } from '@/components';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import request from '@/utils/request';
import './Common.scss';

const UNAUTH_URLS = {
  '/': true,
  '/topics': true,
  '/users/register': true,
  '/users/login': true,
  '/users/join': true,
  '/about/terms-and-conditions': true,
  '/about/privacy-policy': true,
  '/users/join/success': true,
};

class Common extends React.Component {
  initialized = false;

  timer = null;

  constructor(props) {
    super(props);

    this.state = {
      showLoading: false,
    };
  }

  componentDidMount() {
    this.getMyInfo();
  }

  componentDidUpdate(prevProps) {
    const { location, loading } = this.props;
    if (this.initialized && prevProps.location.pathname !== location.pathname) {
      this.checkAuthentification(location.pathname);
    }

    if (!prevProps.loading && loading) {
      setTimeout(() => {
        this.setState({
          showLoading: true,
        });
      }, 0);
    }

    if (prevProps.loading && !loading) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.setState({
          showLoading: false,
        });
      }, 300);
    }
  }

  checkAuthentification = (pathname) => {
    const { user, history } = this.props;
    if (!user.id && !UNAUTH_URLS[pathname]) {
      history.push(`/users/login?url=${pathname}`);
    }
  };

  getMyInfo = () => {
    const { location, setUserAndGrp: setUserAndGrpReducer } = this.props;
    request.get(
      '/api/users/my-info',
      null,
      (data) => {
        setUserAndGrpReducer(data.user || {}, data.grps);
        this.initialized = true;
        this.checkAuthentification(location.pathname);
      },
      () => {
        setUserAndGrpReducer({}, []);
        this.initialized = true;
        this.checkAuthentification(location.pathname);
      },
    );
  };

  getMessageCategoryIcon = (category) => {
    switch (category) {
      case MESSAGE_CATEGORY.ERROR: {
        return <i className="fas fa-exclamation-circle" />;
      }

      case MESSAGE_CATEGORY.WARNING: {
        return <i className="fal fa-exclamation-circle" />;
      }

      case MESSAGE_CATEGORY.INFO: {
        return <i className="fal fa-info-circle" />;
      }

      default: {
        return <i className="fal fa-info-circle" />;
      }
    }
  };

  render() {
    const { messages, loading, t, confirm } = this.props;
    const { setConfirm: setConfirmReducer } = this.props;
    const { showLoading } = this.state;

    return (
      <div className="common-wrapper">
        {messages && messages.length > 0 && (
          <div className="g-overlay">
            <div>
              <div className="common-message">
                <div className={`message-category ${messages[0].category}`}>
                  {this.getMessageCategoryIcon(messages[0].category)}
                </div>
                <div className="message-title">{messages[0].title}</div>
                <div className="message-message">{messages[0].content}</div>
                <div className="message-buttons">
                  <Button
                    className="px-4 mx-1"
                    color="primary"
                    onClick={() => {
                      // eslint-disable-next-line react/destructuring-assignment
                      this.props.clearMessage();
                    }}
                  >
                    {t('button.confirm')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {confirm && confirm.message && (
          <div className="g-overlay">
            <div>
              <div className="common-message">
                <div className="message-title">확인</div>
                <div className="message-message">{confirm.message}</div>
                <div className="message-buttons">
                  <Button
                    className="px-4 mx-1"
                    color="primary"
                    onClick={() => {
                      if (confirm && confirm.okHandler) {
                        confirm.okHandler();
                      }
                      setConfirmReducer(null, null, null);
                    }}
                  >
                    {t('button.confirm')}
                  </Button>
                  <Button
                    className="px-4 mx-1"
                    color="primary"
                    onClick={() => {
                      if (confirm && confirm.noHandler) {
                        confirm.noHandler();
                      }
                      setConfirmReducer(null, null, null);
                    }}
                  >
                    {t('button.cancel')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {(loading || showLoading) && (
          <div className={`g-overlay ${showLoading ? 'show-loading' : 'hide-loading'}`}>
            <div>
              <div>
                <Logo size="md" rotate text={<span>LOADING</span>} />
              </div>
            </div>
          </div>
        )}
        <ReactTooltip effect="solid" />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.message.messages,
    loading: state.loading.loading,
    user: state.user.user,
    confirm: state.confirm,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearMessage: () => dispatch(clearMessage()),
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUserAndGrp: (user, grps) => dispatch(setUserAndGrp(user, grps)),
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Common)));

Common.defaultProps = {
  messages: [],
};

Common.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.any),
  confirm: PropTypes.shape({
    message: PropTypes.string,
    okHandler: PropTypes.func,
    noHandler: PropTypes.func,
  }),
  loading: PropTypes.bool,
  t: PropTypes.func,
  clearMessage: PropTypes.func,
  setUserAndGrp: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  setConfirm: PropTypes.func,
};
