import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row, UserCard } from '@/components';
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
      emptyBackgroundColor,
    } = this.props;

    const { markedUsers, markedTag } = this.props;

    return (
      <div className={`user-manager-wrapper ${className}`}>
        {!(users && users.length > 0) && (
          <div
            className="empty-content text-center"
            style={{
              backgroundColor: emptyBackgroundColor,
            }}
          >
            <div className="info-icon">
              <i className="fal fa-info-circle" />
            </div>
            {emptyContent}
          </div>
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
  emptyContent: <div>설정된 사용자가 없습니다.</div>,
  blockStyle: false,
  hover: false,
  selectedUsers: {},
  lg: 4,
  md: 4,
  sm: 6,
  xs: 12,
  emptyBackgroundColor: 'transparent',
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
  emptyBackgroundColor: PropTypes.string,
  markedUsers: PropTypes.arrayOf(PropTypes.any),
  markedTag: PropTypes.string,
};
