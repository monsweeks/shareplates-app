import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, UserIcon } from '@/components';
import './UserCard.scss';

class UserCard extends React.PureComponent {
  render() {
    const {
      className,
      user,
      hover,
      onClick,
      selected,
      onRemove,
      marked,
      markedTag,
      edit,
      newCard,
      selectedUserMarkedTag,
    } = this.props;

    return (
      <Card
        className={`user-card-wrapper g-no-select ${className} ${hover ? 'hover' : ''} ${selected ? 'selected' : ''} ${
          edit ? 'edit' : ''
        }`}
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
                <UserIcon info={user.info} />
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
              size="sm"
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
          {selected && selectedUserMarkedTag && <div className="marked-tag">{selectedUserMarkedTag}</div>}
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
  newCard: null,
};

UserCard.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    info: PropTypes.shape({
      icon: PropTypes.shape({
        type: PropTypes.string,
        data: PropTypes.objectOf(PropTypes.any),
      }),
    }),
  }),
  hover: PropTypes.bool,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  onRemove: PropTypes.func,
  marked: PropTypes.bool,
  markedTag: PropTypes.string,
  edit: PropTypes.bool,
  newCard: PropTypes.string,
  selectedUserMarkedTag: PropTypes.string,
};
