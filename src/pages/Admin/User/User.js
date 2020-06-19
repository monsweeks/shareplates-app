import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import request from '@/utils/request';
import { PageTitle } from '@/layouts';
import { UserForm } from '@/assets';
import { DATETIME_FORMATS, MESSAGE_CATEGORY } from '@/constants/constants';
import { convertUser } from '@/pages/Users/util';
import dialog from '@/utils/dialog';
import common from '@/utils/common';

class User extends React.PureComponent {
  constructor(props) {
    const {
      match: {
        params: { userId },
      },
    } = props;

    super(props);
    this.state = {
      user: null,
      isCanBeAdmin: true,
      userId,
    };
  }

  componentDidMount() {
    const { userId } = this.state;
    const { t } = this.props;
    this.setState({
      breadcrumbs: [
        {
          name: t('label.breadcrumbs.systemManagement'),
          to: '/admin',
        },
        {
          name: t('label.breadcrumbs.userList'),
          to: '/admin/users',
        },
        {
          name: t('label.breadcrumbs.userInfo'),
          to: `/admin/users/${userId}`,
        },
      ],
    });

    this.getUserInfo(userId);
  }

  getUserInfo = (userId) => {
    request.get(
      `/api/users/${userId}`,
      null,
      (data) => {
        const { user } = data;
        if (user && !user.dateTimeFormat) user.dateTimeFormat = DATETIME_FORMATS[0].key;
        if (user && !user.language) user.language = 'ko';

        const next = convertUser(user);

        this.setState({
          user: next || {},
        });
      },
      () => {
        this.setState({
          user: {},
        });
      },
    );
  };

  deleteUserInfo = (userId) => {
    const { t } = this.props;
    dialog.setConfirm(
      MESSAGE_CATEGORY.WARNING,
      t('label.dialog.title.dataDeleteWarning'),
      t('msg.dialog.content.userDataDeleteWaring'),
      () => {
        const { history } = this.props;
        request.del(`/api/users/${userId}`, null, () => {
          history.push('/admin/users');
        });
      },
    );
  };

  onChange = (field) => (value) => {
    if (field === 'file') {
      const {
        user: { id },
      } = this.state;

      const formData = new FormData();
      formData.append('file', value);
      formData.append('name', value.name);
      formData.append('size', value.size);
      formData.append('type', common.getFileType(value));

      request.post(`/api/users/${id}/image`, formData, (data) => {
        const { user } = this.state;
        const obj = {};
        obj.info = {
          icon: {
            type: 'image',
            data: {
              id: data.id,
              uuid: data.uuid,
            },
          },
        };

        this.setState({
          user: { ...user, ...obj },
        });
      });
    } else if (field === 'avatar') {
      const { user } = this.state;
      const next = { ...user };
      next.info.icon.type = 'avatar';
      next.info.icon.data = value;

      this.setState({
        user: next,
      });
    } else {
      const { user } = this.state;
      const obj = {};
      obj[field] = value;

      this.setState({
        user: { ...user, ...obj },
      });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { user } = this.state;
    const next = { ...user };
    next.info = JSON.stringify(next.info);

    request.put(`/api/users/${user.id}`, next, (data) => {
      this.setState({
        user: convertUser(data.user),
      });
    });
  };

  onDelete = () => {
    const { userId } = this.state;
    this.deleteUserInfo(userId);
  };

  onList = () => {
    const { history } = this.props;
    history.push('/admin/users');
  };

  render() {
    const { t } = this.props;
    const { user, breadcrumbs, isCanBeAdmin } = this.state;

    return (
      <div className="p-4 scrollbar w-100 h-100">
        <PageTitle list={breadcrumbs} border>
          {t('label.page.title.userInfoEdit')}
        </PageTitle>
        <UserForm
          isCanBeAdmin={isCanBeAdmin}
          user={user}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          onDelete={this.onDelete}
          onList={this.onList}
        />
      </div>
    );
  }
}

export default withRouter(withTranslation()(User));

User.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string,
    }),
  }),
};
