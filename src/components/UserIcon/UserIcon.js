import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@/components';
import request from '@/utils/request';

class UserIcon extends React.PureComponent {
  render() {
    const { className, info } = this.props;

    return (
      <div className={`user-icon-wrapper rounded-circle w-100 h-100 border- ${className}`}>
        {info && info.icon && info.icon.type === 'avatar' && <Avatar data={info.icon.data} />}
        {info && info.icon && info.icon.type === 'image' && (
          <img
            className="rounded-circle w-100 h-100"
            src={`${request.getBase()}/files/${info.icon.data.id}?uuid=${info.icon.data.uuid}`}
            alt=""
          />
        )}
        {!info && (
          <span>
            <i className="fal fa-smile" />
          </span>
        )}
      </div>
    );
  }
}

export default UserIcon;

UserIcon.defaultProps = {
  className: '',
};

UserIcon.propTypes = {
  className: PropTypes.string,
  info: PropTypes.shape({
    icon: PropTypes.shape({
      type: PropTypes.string,
      data: PropTypes.objectOf(PropTypes.any),
    }),
  }),
};
