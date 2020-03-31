import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TopLogo } from 'components';
import { withTranslation } from 'react-i18next';
import './Header.scss';
import { connect } from 'react-redux';
import request from '@/utils/request';
import { setUserAndGrp } from '@/actions';
import Menu from '@/layouts/Header/Menu/Menu';
import ShortCutMenu from '@/layouts/Header/ShortCutMenu/ShortCutMenu';
import MobileMenu from '@/layouts/Header/MobileMenu/MobileMenu';
import QuickMenu from '@//layouts/Header/QuickMenu/QuickMenu';

const menus = [
  {
    icon: 'fal fa-books',
    text: 'label.topic',
    to: '/topics',
    side: 'left',
  },
  {
    icon: 'fal fa-book',
    text: 'label.chapter',
    to: '/chapters',
    side: 'left',
    activePropsKey : 'topicId',
  },
  {
    icon: 'fal fa-clipboard',
    text: 'label.page',
    to: '/pages',
    side: 'left',
    activePropsKey : 'chapterId',
  },
  {
    icon: 'fal fa-building',
    text: 'label.org',
    to: '/groups',
    side: 'right',
  },
];

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openMenu: null,
      openQuickMenu: false,
      activePropsKeys: {}
    };
  }

  componentDidUpdate() {
    const { location } = this.props;
    const { activePropsKeys } = this.state;
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

    if (JSON.stringify(activePropsKeys) !== JSON.stringify(nextActivePropsKeys)) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        activePropsKeys : nextActivePropsKeys
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
    const { history, setUserAndGrp: setUserAndGrpReducer } = this.props;

    request.del('/api/users/logout', {}, () => {
      setUserAndGrpReducer({}, []);
      this.setOpenQuickMenu(false);
      history.push('/');
    });
  };

  render() {
    const { i18n, user, location, grps } = this.props;
    const { openMenu, openQuickMenu, activePropsKeys } = this.state;

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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserAndGrp: (user, grps) => dispatch(setUserAndGrp(user, grps)),
  };
};

Header.propTypes = {
  i18n: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),
  grps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  setUserAndGrp: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Header)));
