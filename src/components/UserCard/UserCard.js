import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody } from '@/components';
import './UserCard.scss';
import CircleIcon from '@/components/CircleIcon/CircleIcon';

class UserCard extends React.PureComponent {
  render() {
    const { className, user, blockStyle, hover, onClick, selected, onRemove } = this.props;
    return (
      <Card
        className={`user-card-wrapper g-no-select ${className} ${blockStyle ? 'block-style' : ''} ${
          hover ? 'hover' : ''
        } ${selected ? 'selected' : ''}`}
        onClick={() => {
          if (onClick) {
            onClick(user.id);
          }
        }}
      >
        <CardBody className="p-2">
          <div className="user-card-content">
            <div className="user-icon">
              <span>
                <i className="fal fa-smile" />
              </span>
            </div>
            <div className="separator">
              <div />
            </div>
            <div className="user-text">
              <div className="name">{user.name}</div>
              <div className="email">{user.email}</div>
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
};

UserCard.propTypes = {
  className: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  blockStyle: PropTypes.bool,
  hover: PropTypes.bool,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  onRemove: PropTypes.func,
};
