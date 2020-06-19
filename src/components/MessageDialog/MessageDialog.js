import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button, Overlay } from '@/components';
import './MessageDialog.scss';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';

class MessageDialog extends React.PureComponent {
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
        return null;
      }
    }
  };

  render() {
    const { t, className } = this.props;
    const { type, category, title, message, okHandler, noHandler } = this.props;

    return (
      <Overlay>
        <div className={`message-dialog-wrapper ${className}`}>
          <div>
            <div className={`title ${category}`}>
              <span>
                <span className="category">{this.getMessageCategoryIcon(category)}</span>
                {title}
              </span>
            </div>
            <div className="message">{message}</div>
            <div>
              {(noHandler || type === 'confirm') && (
                <Button
                  size="sm"
                  className="px-4 mx-1"
                  color="secondary"
                  onClick={() => {
                    if (noHandler) {
                      noHandler();
                    }

                    if (type === 'message') {
                      dialog.clearMessage();
                    } else {
                      dialog.clearConfirm();
                    }
                  }}
                >
                  {t('label.button.cancel')}
                </Button>
              )}
              <Button
                className="px-4 mx-1"
                color="primary"
                size="sm"
                onClick={() => {
                  if (okHandler) {
                    okHandler();
                  }

                  if (type === 'message') {
                    dialog.clearMessage();
                  } else {
                    dialog.clearConfirm();
                  }
                }}
              >
                {t('label.button.confirm')}
              </Button>
            </div>
          </div>
        </div>
      </Overlay>
    );
  }
}

export default withTranslation()(MessageDialog);

MessageDialog.defaultProps = {
  className: '',
  type: 'message',
};

MessageDialog.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  t: PropTypes.func,
  category: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  okHandler: PropTypes.func,
  noHandler: PropTypes.func,
};
