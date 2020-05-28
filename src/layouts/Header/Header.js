import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TopLogo } from 'components';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import request from '@/utils/request';
import { setUserInfo } from '@/actions';
import Menu from '@/layouts/Header/Menu/Menu';
import ShortCutMenu from '@/layouts/Header/ShortCutMenu/ShortCutMenu';
import MobileMenu from '@/layouts/Header/MobileMenu/MobileMenu';
import QuickMenu from '@//layouts/Header/QuickMenu/QuickMenu';
import './Header.scss';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: null,
      openQuickMenu: false,
      activePropsKeys: {},
      menus: [
        {
          key: 'shares',
          icon: 'fal fa-broadcast-tower',
          text: 'label.share',
          to: '/shares',
          side: 'left',
          alias: '/shares',
          split: true,
        },
        {
          key: 'topics',
          icon: 'fal fa-books',
          text: 'label.topic',
          to: '/topics',
          side: 'left',
          alias: '/topics',
        },
        {
          key: 'chapters',
          icon: 'fal fa-book',
          text: 'label.chapter',
          to: '/chapters',
          side: 'left',
          activePropsKey: 'topicId',
          alias: '/chapters',
        },
        {
          key: 'pages',
          icon: 'fal fa-clipboard',
          text: 'label.page',
          to: '/pages',
          side: 'left',
          activePropsKey: 'chapterId',
          alias: '/pages',
        },
        {
          key: 'groups',
          icon: 'fal fa-building',
          text: 'label.org',
          to: '/groups',
          side: 'left',
          alias: '/groups',
        },
      ],
    };
  }

  componentDidUpdate() {
    const { location } = this.props;
    const { activePropsKeys, menus } = this.state;
    const values = location.pathname.split('/');
    let currentTopicId = null;
    let currentChapterId = null;

    if (values.length > 0) {
      if (values[1] === 'topics' && values[2] && !Number.isNaN(values[2])) {
        currentTopicId = Number(values[2]);
      }

      if (values[3] === 'chapters' && values[4] && !Number.isNaN(values[4])) {
        currentChapterId = Number(values[4]);
      }
    }

    const nextActivePropsKeys = {
      topicId: currentTopicId,
      chapterId: currentChapterId,
    };

    const nextMenus = menus.slice(0);
    if (nextActivePropsKeys.topicId) {
      const chapters = nextMenus.find((d) => d.key === 'chapters');
      chapters.to = `/topics/${nextActivePropsKeys.topicId}/chapters`;
    }

    if (nextActivePropsKeys.topicId && nextActivePropsKeys.chapterId) {
      const pages = nextMenus.find((d) => d.key === 'pages');
      pages.to = `/topics/${nextActivePropsKeys.topicId}/chapters/${nextActivePropsKeys.chapterId}/pages`;
    }

    if (JSON.stringify(activePropsKeys) !== JSON.stringify(nextActivePropsKeys)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        activePropsKeys: nextActivePropsKeys,
        menus: nextMenus,
      });
    }
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

  onSearch = () => {
    console.log('search');
  };

  logout = () => {
    const { history, setUserInfo: setUserInfoReducer } = this.props;

    request.del('/api/users/logout', {}, () => {
      setUserInfoReducer({}, [], 0);
      this.setOpenQuickMenu(false);
      history.push('/');
    });
  };

  render() {
    const { i18n, user, location, grps, shareCount } = this.props;
    const { openMenu, openQuickMenu, activePropsKeys, menus } = this.state;

    const ready = user !== null;
    const loggedIn = !!(user && user.id);

    return (
      <header className="top-header-wrapper g-no-select">
        <div className="top-header-menu">
          <div className="left-menu-area text-left d-flex d-md-block pl-md-0">
            <Menu
              menus={menus.filter((menu) => menu.side === 'left')}
              pathname={location.pathname}
              openMenu={openMenu}
              setOpen={this.setOpen}
              activePropsKeys={activePropsKeys}
              shareBadgeCount={shareCount}
            />
          </div>
          <div className="logo-area">
            <TopLogo weatherEffect />
          </div>
          <div className="right-menu-area text-right pl-md-0">
            <div className="right-menu">
              <Menu menus={menus.filter((menu) => menu.side === 'right')} pathname={location.pathname} />
            </div>
            <div className="shortcut-menu">
              <ShortCutMenu
                ready={ready}
                loggedIn={loggedIn}
                setOpenQuickMenu={this.setOpenQuickMenu}
                language={i18n.language}
                onChangeLanguage={(language) => {
                  i18n.changeLanguage(language);
                }}
                onSearch={this.onSearch}
                grps={grps}
                user={user}
              />
            </div>
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
          activePropsKeys={activePropsKeys}
        />
        {openMenu && (
          <div
            className="overlay d-md-none"
            onClick={() => {
              this.setOpen(false);
            }}
          />
        )}
        <QuickMenu
          openQuickMenu={openQuickMenu}
          user={user}
          language={i18n.language}
          setOpenQuickMenu={this.setOpenQuickMenu}
          logout={this.logout}
          onChangeLanguage={(language) => {
            i18n.changeLanguage(language);
          }}
        />
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    grps: state.user.grps,
    shareCount: state.user.shareCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (user, grps, shareCount) => dispatch(setUserInfo(user, grps, shareCount)),
  };
};

Header.propTypes = {
  i18n: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  grps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  shareCount: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  setUserInfo: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Header)));
