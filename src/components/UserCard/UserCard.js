import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Card, CardBody } from '@/components';
import './UserCard.scss';
import CircleIcon from '@/components/CircleIcon/CircleIcon';

class UserCard extends React.PureComponent {
  render() {
    const { className, user, blockStyle, hover, onClick, selected, onRemove, marked, markedTag, border } = this.props;

    return (
      <Card
        className={`user-card-wrapper g-no-select ${className} ${border ? 'has-border' : ''} ${
          blockStyle ? 'block-style' : ''
        } ${hover ? 'hover' : ''} ${selected ? 'selected' : ''}`}
        onClick={() => {
          if (onClick) {
            onClick(user.id);
          }
        }}
      >
        <CardBody>
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
              <div className="email" data-tip={user.email}>
                {user.email}
              </div>
            </div>
          </div>
          {onRemove && (
            <CircleIcon
              className="remove-button bg-transparent text-danger"
              icon={<i className="fal fa-times" />}
              onClick={() => {
                onRemove(user.id);
              }}
            />
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
};
