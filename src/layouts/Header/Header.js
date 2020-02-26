import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TopLogo } from 'components';
import { withTranslation } from 'react-i18next';
import './Header.scss';
import { connect } from 'react-redux';
import request from '@/utils/request';
import { setUser } from '@/actions';
import Menu from '@/layouts/Header/Menu/Menu';
import ShortCutMenu from '@/layouts/Header/ShortCutMenu/ShortCutMenu';
import MobileMenu from '@/layouts/Header/MobileMenu/MobileMenu';
import QuickMenu from '@//layouts/Header/QuickMenu/QuickMenu';

const menus = [
  {
    icon: 'fal fa-books',
    text: 'label.topic',
    to: '/topics',
  },
  {
    icon: 'fal fa-book',
    text: 'label.chapter',
    to: '/chapters',
  },
  {
    icon: 'fal fa-clipboard',
    text: 'label.page',
    to: '/pages',
  },
];

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: null,
      openQuickMenu: false,
    };
  }

  setOpen = (openMenu) => {
    this.setState({
      openMenu,
    });
  };

  setOpenQuickMenu = (openQuickMenu) => {
    this.setState({
      openQuickMenu,
    });
  };

  logout = () => {
    const { setUser: setUserReducer } = this.props;

    request.del('/api/users/logout', {}, () => {
      setUserReducer({});
      this.setOpenQuickMenu(false);
    });
  };

  render() {
    const { i18n, user, location} = this.props;
    const { openMenu, openQuickMenu } = this.state;

    const ready = user !== null;
    const loggedIn = !!(user && user.id);

    return (
      <header className="top-header-wrapper g-no-select">
        <div className="top-header-menu">
          <div className="menu-area text-left d-flex d-md-block pl-md-0">
            <Menu menus={menus} pathname={location.pathname} openMenu={openMenu} setOpen={this.setOpen} />
          </div>
          <div className="logo-area">
            <TopLogo weatherEffect />
          </div>
          <div className="shortcut-area">
            <ShortCutMenu
              ready={ready}
              loggedIn={loggedIn}
              setOpenQuickMenu={this.setOpenQuickMenu}
              language={i18n.language}
              onChangeLanguage={(language) => {
                i18n.changeLanguage(language);
              }}
            />
          </div>
        </div>
        <MobileMenu
          menus={menus}
          openMenu={openMenu}
          setOpen={this.setOpen}
          ready={ready}
          loggedIn={loggedIn}
          onChangeLanguage={(language) => {
            i18n.changeLanguage(language);
          }}
          language={i18n.language}
        />
        {openMenu && (
          <div
            className="overlay d-md-none"
            onClick={() => {
              this.setOpen(false);
            }}
          />
        )}

        <QuickMenu openQuickMenu={openQuickMenu} user={user} language={i18n.language} setOpenQuickMenu={this.setOpenQuickMenu}
logout={this.logout}
                   onChangeLanguage={(language) => {
                     i18n.changeLanguage(language);
                   }} />




      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

Header.propTypes = {
  i18n: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    picturePath: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  setUser: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Header)));
