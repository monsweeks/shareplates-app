import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { addMessage, clearMessage, setUserAndOrganization } from 'actions';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Button, Logo } from '@/components';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import request from '@/utils/request';
import './Common.scss';

const UNAUTH_URLS = {
  '/': true,
  '/topics': true,
  '/users/login': true,
  '/users/join': true,
  '/about/terms-and-conditions': true,
  '/about/privacy-policy': true,
  '/users/join/success': true,
};

class Common extends React.PureComponent {
  initialized = false;

  componentDidMount() {
    this.getMyInfo();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (this.initialized && prevProps.location.pathname !== location.pathname) {
      this.checkAuthentification(location.pathname);
    }
  }

  checkAuthentification = (pathname) => {
    const { user, history } = this.props;
    if (!user.id && !UNAUTH_URLS[pathname]) {
      history.push(`/users/login?url=${pathname}`);
    }
  };

  getMyInfo = () => {
    const { location, setUserAndOrganization: setUserAndOrganizationReducer } = this.props;
    request.get(
      '/api/users/my-info',
      null,
      (data) => {
        setUserAndOrganizationReducer(data.user || {}, data.organizations);
        this.initialized = true;
        this.checkAuthentification(location.pathname);
      },
      () => {
        setUserAndOrganizationReducer({}, []);
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
    const { messages, loading, t } = this.props;

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
        {loading && (
          <div className="g-overlay">
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearMessage: () => dispatch(clearMessage()),
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUserAndOrganization: (user, organizations) => dispatch(setUserAndOrganization(user, organizations)),
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Common)));

Common.defaultProps = {
  messages: [],
};

Common.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.bool,
  t: PropTypes.func,
  clearMessage: PropTypes.func,
  setUserAndOrganization: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
};
