import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, UserIcon } from '@/components';
import './ShareStandByUserCard.scss';

class ShareStandByUserCard extends React.PureComponent {
  render() {
    const { user, message, className, isAdmin } = this.props;

    return (
      <Card className={`share-stand-by-user-card-wrapper ${className} ${user.status !== 'ONLINE' ? 'OFFLINE' : ''}`}>
        <CardBody className="p-0">
          <div className="user-card-content">
            {isAdmin && (
              <div className="crown-icon">
                <span>
                  <i className="fas fa-crown" />
                </span>
              </div>
            )}
            {user.status !== 'ONLINE' && (
              <span className="status">
                  <span>OFFLINE</span>
                </span>
            )}
            <div className="user-info">
              <div className="user-icon">
                <div>{user && <UserIcon info={user.info} />}</div>
              </div>
              <div className="user-name">
                <span>{user.name}</span>
              </div>
            </div>
            <div className="chat">
              <div className="bullet">
                <span />
              </div>
              <div className="message">
                <div>
                  <div className="message-span scrollbar"><div>{message}</div></div>
                </div>
              </div>
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
    info: PropTypes.shape({
      icon: PropTypes.shape({
        type: PropTypes.string,
        data: PropTypes.objectOf(PropTypes.any),
      }),
    }),
    status: PropTypes.string,
    message: PropTypes.string,
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.shape({
      icon: PropTypes.shape({
        type: PropTypes.string,
        data: PropTypes.objectOf(PropTypes.any),
      }),
    }),
  }),
  isAdmin: PropTypes.bool,
  className: PropTypes.string,
  message: PropTypes.string,
};

export default withRouter(withTranslation()(ShareStandByUserCard));
