import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import request from '@/utils/request';
import { addMessage, setUserInfo } from '@/actions';
import { PageTitle, RegisterLayout } from '@/layouts';
import { UserForm } from '@/assets';
import { DATETIME_FORMATS } from '@/constants/constants';
import './EditMyInfo.scss';
import { convertUser } from '@/pages/Users/util';

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
        });
      },
      () => {
        this.setState({
          user: {},
        });
      },
    );
  };

  onChange = (field) => (value) => {
    const { user } = this.state;
    const obj = {};
    obj[field] = value;

    this.setState({
      user: { ...user, ...obj },
    });
  };

  onChangeAvatar = (value) => {
    const { user } = this.state;
    const next = { ...user };
    next.info.icon.type = 'avatar';
    next.info.icon.data = value;

    this.setState({
      user: next,
    });
  };

  getFileType = (file) => {
    if (!/^image\//.test(file.type)) {
      return 'image';
    }
    if (!/^video\//.test(file.type)) {
      return 'video';
    }
    return 'file';
  };

  onChangeFile = (file) => {
    const {
      user: { id },
    } = this.state;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('size', file.size);
    formData.append('type', this.getFileType(file));

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
    const { user } = this.state;

    return (
      <RegisterLayout>
        <PageTitle list={breadcrumbs} border>
          {t('내 정보 수정')}
        </PageTitle>
        <UserForm
          user={user}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          onChangeFile={this.onChangeFile}
          onChangeAvatar={this.onChangeAvatar}
        />
      </RegisterLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUserInfo: (user, grps, shareCount) => dispatch(setUserInfo(user, grps, shareCount)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(EditMyInfo)));

EditMyInfo.propTypes = {
  t: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
