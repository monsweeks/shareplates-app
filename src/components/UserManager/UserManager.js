import React from 'react';
import PropTypes from 'prop-types';
import { Col, EmptyMessage, Row, UserCard } from '@/components';
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
      lg,
      md,
      sm,
      xs,
      onRemove,
    } = this.props;

    const { markedUsers, markedTag } = this.props;

    return (
      <div className={`user-manager-wrapper ${className}`}>
        {!(users && users.length > 0) && (
          <EmptyMessage
            className="h6 mb-0"
            message={
              <div>
                <div>
                  <span className='mr-1'>
                    <i className="fal fa-hashtag" />
                  </span>
                  <span>{emptyContent}</span>
                </div>
              </div>
            }
          />
        )}
        {users && users.length > 0 && (
          <Row>
            {users.map((user) => {
              return (
                <Col className="user-col" key={user.id} lg={lg} md={md} sm={sm} xs={xs}>
                  <UserCard
                    onClick={onClick}
                    hover={hover}
                    user={user}
                    blockStyle={blockStyle}
                    selected={selectedUsers[user.id]}
                    marked={markedUsers.find((u) => u.id === user.id)}
                    markedTag={markedTag}
                    onRemove={onRemove}
                  />
                </Col>
              );
            })}
          </Row>
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
  lg: 4,
  md: 4,
  sm: 6,
  xs: 12,
  markedUsers: [],
  markedTag: null,
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
  lg: PropTypes.number,
  md: PropTypes.number,
  sm: PropTypes.number,
  xs: PropTypes.number,
  onRemove: PropTypes.func,
  markedUsers: PropTypes.arrayOf(PropTypes.any),
  markedTag: PropTypes.string,
};
