import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { setUserInfo } from 'actions';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Logo, MessageDialog } from '@/components';
import request from '@/utils/request';
import './Common.scss';
import { convertUser } from '@/pages/Users/util';

const UNAUTH_URLS = {
  '/': true,
  '/shares': true,
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
    if ((!user || !user.id) && !UNAUTH_URLS[pathname]) {
      history.push(`/users/login?url=${pathname}`);
    }
  };

  getMyInfo = () => {
    const { location, setUserInfo: setUserInfoReducer } = this.props;
    request.get(
      '/api/users/my-info',
      null,
      (data) => {
        setUserInfoReducer(convertUser(data.user) || {}, data.grps, data.shareCount);
        this.initialized = true;
        this.checkAuthentification(location.pathname);
      },
      () => {
        setUserInfoReducer({}, [], 0);
        this.initialized = true;
        this.checkAuthentification(location.pathname);
      },
    );
  };

  render() {
    const { message, loading, confirm } = this.props;
    const { showLoading } = this.state;

    return (
      <div className="common-wrapper">
        {message && message.content && (
          <MessageDialog
            type="message"
            category={message.category}
            title={message.title}
            message={message.content}
            okHandler={message.okHandler}
          />
        )}
        {confirm && confirm.content && (
          <MessageDialog
            type="confirm"
            category={confirm.category}
            title={confirm.title}
            message={confirm.content}
            okHandler={confirm.okHandler}
            noHandler={confirm.noHandler}
          />
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
        <ReactTooltip effect="solid"  />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    message: state.message,
    loading: state.loading.loading,
    user: state.user.user,
    confirm: state.confirm,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (user, grps, shareCount) => dispatch(setUserInfo(user, grps, shareCount)),
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Common)));

Common.propTypes = {
  message: PropTypes.shape({
    category: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    okHandler: PropTypes.func,
  }),
  confirm: PropTypes.shape({
    category: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    okHandler: PropTypes.func,
    noHandler: PropTypes.func,
  }),
  loading: PropTypes.bool,
  setUserInfo: PropTypes.func,
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
