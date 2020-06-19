import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import request from '@/utils/request';
import { setUserInfo } from '@/actions';
import { PageTitle, RegisterLayout } from '@/layouts';
import { UserForm } from '@/assets';
import { DATETIME_FORMATS } from '@/constants/constants';
import { convertUser } from '@/pages/Users/util';
import common from '@/utils/common';

const breadcrumbs = [
  {
    name: '내 정보',
    to: '/users/my-info/edit',
  },
  {
    name: '수정',
    to: '/users/my-info',
  },
];

class EditMyInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isCanBeAdmin: false,
    };
  }

  componentDidMount() {
    this.getMyInfo();
  }

  getMyInfo = () => {
    request.get(
      '/api/users/my-info',
      null,
      (data) => {
        const { user } = data;
        if (user && !user.dateTimeFormat) user.dateTimeFormat = DATETIME_FORMATS[0].key;
        if (user && !user.language) user.language = 'ko';

        const next = convertUser(user);

        this.setState({
          user: next || {},
          isCanBeAdmin: next.roleCode === 'SUPER_MAN',
        });
      },
      () => {
        this.setState({
          user: {},
        });
      },
    );
  };

  onCancel = () => {
    const { history } = this.props;
    history.goBack();
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
    const { setUserInfo: setUserInfoReducer } = this.props;
    const next = { ...user };
    next.info = JSON.stringify(next.info);

    request.put('/api/users/my-info', next, (data) => {
      setUserInfoReducer(convertUser(data.user) || {}, data.grps, data.shareCount);
      this.getMyInfo();
    });
  };

  render() {
    const { t } = this.props;
    const { user, isCanBeAdmin } = this.state;

    return (
      <RegisterLayout>
        <PageTitle list={breadcrumbs} border>
          {t('내 정보 수정')}
        </PageTitle>
        <UserForm
          isCanBeAdmin={isCanBeAdmin}
          user={user}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          onCancel={this.onCancel}
        />
      </RegisterLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (user, grps, shareCount) => dispatch(setUserInfo(user, grps, shareCount)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(EditMyInfo)));

EditMyInfo.propTypes = {
  t: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }),
};
