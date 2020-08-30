import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, Card, CardBody, UserIcon } from '@/components';
import './ShareUserCard.scss';
import { UserPropTypes } from '@/proptypes';

class ShareUserCard extends React.PureComponent {
  render() {
    const { currentUser, user, className, adminCard, userControl, border } = this.props;
    const { banUser, kickOutUser, allowUser } = this.props;

    const isMe = user.id === currentUser.id;

    return (
      <Card key={user.id} className={`share-user-card-wrapper ${className} ${border ? 'has-border' : ''}`}>
        <CardBody className="p-0">
          <div className={`user-card-content ${user.status !== 'ONLINE' ? 'OFFLINE' : ''}`}>
            <div className={`user-connection-status ${user.status}`}>
              <div />
            </div>
            <div className={`user-focus-status ${user.status} ${user.focusYn ? 'focus' : 'out-focus'}`}>
              <div />
            </div>
            {adminCard && (
              <div className="crown-icon">
                <span>
                  <i className="fas fa-crown" />
                </span>
              </div>
            )}
            <div className="user-icon">
              <div>{user && <UserIcon info={user.info} />}</div>
            </div>
            <div className="user-name">
              <span>{user.name}</span>
              {isMe && <span className='me-tag'>ME</span>}
            </div>
            {userControl && (
              <div className="user-control-buttons">
                {!user.banYn && (
                  <>
                    <Button
                      color="warning"
                      size='sm'
                      onClick={() => {
                        kickOutUser(user.id);
                      }}
                    >
                      내보내기
                    </Button>
                    <Button
                      color="danger"
                      size='sm'
                      onClick={() => {
                        banUser(user.id);
                      }}
                    >
                      추방
                    </Button>
                  </>
                )}
                {user.banYn && (
                  <>
                    <Button
                      color="danger"
                      onClick={() => {
                        allowUser(user.id);
                      }}
                    >
                      <i className="fal fa-redo" />
                    </Button>
                  </>
                )}
              </div>
            )}
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
  user: UserPropTypes,
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
  adminCard: PropTypes.bool,
  className: PropTypes.string,
  userControl: PropTypes.bool,
  border: PropTypes.bool,
  banUser: PropTypes.func,
  kickOutUser: PropTypes.func,
  allowUser: PropTypes.func,
};

export default withRouter(withTranslation()(ShareUserCard));
