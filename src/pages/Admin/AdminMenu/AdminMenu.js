import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { UserPropTypes } from '@/proptypes';
import './AdminMenu.scss';

const menus = [
  {
    key: '/admin/users',
    value: '사용자',
  },
  {
    key: '/admin/groups',
    value: '그룹',
  },
  {
    key: '/admin/topics',
    value: '토픽',
  },
  {
    key: '/admin/shares',
    value: '공유',
  },
  {
    key: '/admin/systems',
    value: '시스템',
  },
];

class AdminMenu extends React.PureComponent {
  componentDidMount() {
    this.checkIsAdmin();
  }

  componentDidUpdate() {
    this.checkIsAdmin();
  }

  checkIsAdmin = () => {
    const { user, history } = this.props;
    if (user && !user.isAdmin) {
      history.push('/');
    }
  };

  render() {
    const { t } = this.props;
    const { history, location } = this.props;

    return (
      <div className="admin-menu-wrapper g-no-select">
        <ul>
          {menus.map((menu) => {
            return (
              <li
                key={menu.key}
                className={`${location.pathname.indexOf(menu.key) === 0 ? 'selected' : ''}`}
                onClick={() => {
                  history.push(menu.key);
                }}
              >
                {t(menu.value)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

AdminMenu.propTypes = {
  user: UserPropTypes,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(AdminMenu)));
