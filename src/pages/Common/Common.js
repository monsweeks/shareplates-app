import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { addMessage, clearMessage, setUser } from 'actions';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Button, Logo } from '@/components';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import request from '@/utils/request';
import './Common.scss';

class Common extends React.PureComponent {
  componentDidMount() {
    this.getMyInfo();
  }

  getMyInfo = () => {
    const { setUser: setUserReducer } = this.props;
    request.get(
      '/api/users/my-info',
      null,
      (data) => {
        if (data.user) {
          setUserReducer(data.user, data.organizations);
        } else {
          setUserReducer({}, []);
        }
      },
      () => {
        setUserReducer({}, []);
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearMessage: () => dispatch(clearMessage()),
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUser: (user, organizations) => dispatch(setUser(user, organizations)),
  };
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Common));

Common.defaultProps = {
  messages: [],
};

Common.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.bool,
  t: PropTypes.func,
  clearMessage: PropTypes.func,
  setUser: PropTypes.func,
};
