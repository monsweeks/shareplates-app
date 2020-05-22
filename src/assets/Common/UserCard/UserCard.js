import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button, Card, CardBody } from '@/components';
import './UserCard.scss';

class UserCard extends React.PureComponent {
  render() {
    const {
      className,
      user,
      blockStyle,
      hover,
      onClick,
      selected,
      onRemove,
      marked,
      markedTag,
      border,
      edit,
      newCard,
    } = this.props;

    return (
      <Card
        className={`user-card-wrapper g-no-select ${className} ${border ? 'has-border' : ''} ${
          blockStyle ? 'block-style' : ''
        } ${hover ? 'hover' : ''} ${selected ? 'selected' : ''} ${edit ? 'edit' : ''}`}
        onClick={() => {
          if (onClick) {
            if (user) {
              onClick(user.id);
            } else {
              onClick();
            }
          }
        }}
      >
        <CardBody className="p-0">
          {!newCard && (
            <div className="user-card-content">
              <div className="user-icon">
                {user.info && <Avatar data={JSON.parse(user.info)} />}
                {!user.info && (
                  <span>
                    <i className="fal fa-smile" />
                  </span>
                )}
              </div>
              <div className="user-text">
                <div className="name">{user.name}</div>
                <div className="email">{user.email}</div>
              </div>
            </div>
          )}
          {newCard && (
            <div className="user-card-content">
              <div className="new-card">
                <i className="fal fa-plus" />
                <div className="text">{newCard}</div>
              </div>
            </div>
          )}
          {onRemove && (
            <Button
              size='sm'
              color="danger"
              className="remove-button"
              onClick={() => {
                onRemove(user.id);
              }}
            >
              <i className="fal fa-times" />
            </Button>
          )}
          {marked && <div className="marked-tag">{markedTag}</div>}
        </CardBody>
      </Card>
    );
  }
}

export default UserCard;

UserCard.defaultProps = {
  className: '',
  hover: false,
  selected: false,
  marked: false,
  markedTag: '',
  border: true,
  newCard: null,
};

UserCard.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    info: PropTypes.string,
  }),
  blockStyle: PropTypes.bool,
  hover: PropTypes.bool,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  onRemove: PropTypes.func,
  marked: PropTypes.bool,
  markedTag: PropTypes.string,
  border: PropTypes.bool,
  edit: PropTypes.bool,
  newCard: PropTypes.string,
};
