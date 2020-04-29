import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ShareUserCard.scss';
import { Avatar, Button, Card, CardBody } from '@/components';

class ShareUserCard extends React.PureComponent {
  render() {
    const { currentUser, user, className, adminCard, userControl } = this.props;
    const isMe = user.id === currentUser.id;

    console.log(currentUser);

    return (
      <Card key={user.id} className={`share-user-card-wrapper ${className} border-0`}>
        <CardBody className="p-0">
          <div className={`user-card-content ${user.status !== 'ONLINE' ? 'OFFLINE' : ''}`}>
            {adminCard && (
              <div className="crown-icon">
                <span>
                  <i className="fas fa-crown" />
                </span>
              </div>
            )}
            {isMe && (
              <div className="user-tag-info">
                <span>ME</span>
              </div>
            )}
            <div className="user-icon">
              <div>
                {user.info && <Avatar data={JSON.parse(user.info)} />}
                {!user.info && <span className="default-icon" />}
              </div>
            </div>
            <div className="user-name">
              <span>{user.name}</span>
            </div>
            {userControl && (
              <div className="user-control-buttons">
                <Button color='danger'>
                  <i className="fal fa-sign-out"/>
                </Button>
                <Button color='danger'>
                  <i className="fal fa-times"/>
                </Button>
              </div>
            )}
            <div className={`user-status ${user.status}`}>
              <span>{user.status}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}

ShareUserCard.defaultProps = {
  className: '',
};

ShareUserCard.propTypes = {
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
  adminCard: PropTypes.bool,
  className: PropTypes.string,
  userControl : PropTypes.bool,
};

export default withRouter(withTranslation()(ShareUserCard));
