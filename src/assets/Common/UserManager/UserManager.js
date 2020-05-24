import React from 'react';
import PropTypes from 'prop-types';
import { EmptyMessage } from '@/components';
import { UserCard } from '@/assets';
import './UserManager.scss';

class UserManager extends React.PureComponent {
  render() {
    const {
      users,
      className,
      emptyContent,
      blockStyle,
      hover,
      onClick,
      selectedUsers,
      onRemove,
      border,
      edit,
      newCard,
      onNewCard,
      popupContent,
      singleRow,
    } = this.props;

    const { markedUsers, markedTag } = this.props;

    return (
      <div className={`user-manager-wrapper ${className}`}>
        {!(users && users.length > 0) && !newCard && (
          <EmptyMessage
            className="h6 mb-0 d-flex flex-grow-1 h-100"
            message={
              <div>
                <div>
                  <span className="mr-1">
                    <i className="fal fa-hashtag" />
                  </span>
                  <span>{emptyContent}</span>
                </div>
              </div>
            }
          />
        )}
        {(users && users.length > 0 || newCard) && (
          <div className={`list ${popupContent ? 'in-popup-list' : ''} ${singleRow ? 'single-row' : ''}`}>
            {users.map((user) => {
              return (
                <div className="user-col" key={user.id}>
                  <UserCard
                    onClick={onClick}
                    hover={hover}
                    user={user}
                    blockStyle={blockStyle}
                    selected={selectedUsers[user.id]}
                    marked={!!markedUsers.find((u) => u.id === user.id)}
                    markedTag={markedTag}
                    onRemove={onRemove}
                    border={border}
                    edit={edit}
                  />
                </div>
              );
            })}
            {newCard && (
              <div className="user-col">
                <UserCard onClick={onNewCard} newCard={newCard} hover />
              </div>

            )}
          </div>
        )}
      </div>
    );
  }
}

export default UserManager;

UserManager.defaultProps = {
  className: '',
  emptyContent: '설정된 사용자가 없습니다.',
  blockStyle: false,
  hover: false,
  selectedUsers: {},
  markedUsers: [],
  markedTag: null,
  border: true,
  edit: false,
  newCard: null,
  popupContent: false,
  singleRow : false,
};

UserManager.propTypes = {
  className: PropTypes.string,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  ),
  emptyContent: PropTypes.node,
  blockStyle: PropTypes.bool,
  hover: PropTypes.bool,
  onClick: PropTypes.func,
  selectedUsers: PropTypes.objectOf(PropTypes.any),
  onRemove: PropTypes.func,
  markedUsers: PropTypes.arrayOf(PropTypes.any),
  markedTag: PropTypes.string,
  border: PropTypes.bool,
  edit: PropTypes.bool,
  newCard: PropTypes.string,
  onNewCard : PropTypes.func,
  popupContent : PropTypes.bool,
  singleRow : PropTypes.bool,
};
