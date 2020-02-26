import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Link, Row, TopLogo } from 'components';
import { withTranslation } from 'react-i18next';
import './Header.scss';
import { connect } from 'react-redux';
import LANGUAGES from '../../languages/languages';
import request from '@/utils/request';
import { addMessage, setUser } from '@/actions';
import { MESSAGE_CATEGORY } from '@/constants/constants';

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

  getMenuClass = (openMenu) => {
    if (openMenu === null) {
      return '';
    }

    if (openMenu) {
      return 'menu-open';
    }

    return 'menu-close';
  };

  logout = () => {
    const { setUser: setUserReducer } = this.props;

    request.del('/api/users/logout', {}, () => {
      setUserReducer({});
      this.setOpenQuickMenu(false);
    });
  };

  render() {
    const { t, i18n, user, location, addMessage: addMessageReducer } = this.props;
    const { openMenu, openQuickMenu } = this.state;

    const ready = user !== null;
    const loggedIn = user && user.id;

    return (
      <header className="top-header-wrapper g-no-select">
        <div className="top-header-menu">
          <div className="menu-area text-left d-flex d-md-block pl-2 pl-md-0">
            <Button
              className="d-inline-block d-md-none align-self-center"
              color="primary"
              onClick={() => {
                this.setOpen(!openMenu);
              }}
            >
              <i className="fas fa-bars" />
            </Button>
            {menus.map((menu) => {
              let alias = '';
              if (location.pathname.indexOf('/pages') > -1) {
                alias = '/pages';
              } else if (location.pathname.indexOf('/chapters') > -1) {
                alias = '/chapters';
              } else if (location.pathname.indexOf('/topics') > -1) {
                alias = '/topics';
              } else if (location.pathname === '/') {
                alias = '/topics';
              }

              return (
                <Link
                  underline={false}
                  key={menu.text}
                  className={`${
                    alias === menu.to || location.pathname === menu.to ? 'selected' : ''
                  } d-none d-md-inline-block menu-item`}
                  to={menu.to}
                  effect={false}
                >
                  <div className="screen screen-1" />
                  <div className="screen screen-2" />
                  <div className="screen screen-3" />
                  <div className="screen screen-4" />
                  <div className="current-arrow">
                    <span />
                  </div>
                  <div className="icon">
                    <span>
                      <i className={menu.icon} />
                    </span>
                  </div>
                  <div className="text">
                    <span>{t(menu.text)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="logo-area">
            <TopLogo weatherEffect />
          </div>
          <div className="shortcut-area">
            {ready && loggedIn && (
              <span
                className="user-icon"
                onClick={() => {
                  this.setOpenQuickMenu(!openQuickMenu);
                }}
              >
                <i className="fal fa-robot" />
              </span>
            )}
            {ready && !loggedIn && (
              <>
                <Link
                  className="d-inline-block"
                  underline={false}
                  componentClassName="mr-4 p-0 px-md-2"
                  color="white"
                  to="/users/login"
                  effect={false}
                >
                  {t('label.login')}
                </Link>
                <div className="separator d-none d-md-inline-block" />
                <div className="g-radio-button language-button d-none d-md-inline-block">
                  {Object.keys(LANGUAGES)
                    .sort()
                    .reverse()
                    .map((language) => {
                      return (
                        <button
                          key={language}
                          type="button"
                          className={`${i18n.language === language ? 'selected' : ''}`}
                          onClick={() => {
                            i18n.changeLanguage(language);
                          }}
                        >
                          {t(language)}
                        </button>
                      );
                    })}
                </div>
              </>
            )}
          </div>
        </div>
        {openMenu && (
          <div
            className="overlay d-md-none"
            onClick={() => {
              this.setOpen(false);
            }}
          />
        )}
        <div className={`mobile-menu-area d-md-none ${this.getMenuClass(openMenu)}`}>
          <div>
            <div className="top">
              <TopLogo weatherEffect />
              <Button
                color="secondary"
                className="close-button shadow-none bg-transparent border-0"
                onClick={() => {
                  this.setOpen(false);
                }}
              >
                <i className="fal fa-times h5 font-weight-lighter m-0" />
              </Button>
            </div>
            <div className="menu-list">
              <ul>
                {menus.map((menu) => {
                  return (
                    <li key={menu.text}>
                      <Link
                        underline={false}
                        className="d-inline-block menu-item"
                        onClick={() => {
                          this.setOpen(false);
                        }}
                        to={menu.to}
                      >
                        <div className="icon">
                          <span>
                            <i className={menu.icon} />
                          </span>
                        </div>
                        <div className="text">
                          <span>{t(menu.text)}</span>
                        </div>
                        <span className="arrow">
                          <i className="fal fa-chevron-right" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="link-area">
              {ready && !loggedIn && (
                <Link
                  componentClassName="px-2"
                  color="blue"
                  to="/users/login"
                  onClick={() => {
                    this.setOpen(false);
                  }}
                >
                  {t('label.login')}
                </Link>
              )}
            </div>

            <div className="shortcut-area">
              {ready && !loggedIn && (
                <div>
                  <span className="text-black small mr-2">언어 설정</span>
                  <div className="g-radio-button">
                    {Object.keys(LANGUAGES)
                      .sort()
                      .reverse()
                      .map((language) => {
                        return (
                          <button
                            key={language}
                            type="button"
                            className={`${i18n.language === language ? 'selected' : ''}`}
                            onClick={() => {
                              i18n.changeLanguage(language);
                            }}
                          >
                            {t(language)}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {openQuickMenu && (
          <>
            <div
              className="overlay"
              onClick={() => {
                this.setOpenQuickMenu(false);
              }}
            />
            <div className="quick-menu g-no-select">
              <div className="arrow">
                <span className="arrow-marker g-border-normal" />
                <span className="arrow-hider" />
              </div>
              <Card className="g-border-normal border-0 rounded-sm">
                <CardHeader className="g-border-normal p-3 bg-white rounded-sm border-0">
                  <span className="user-info">
                    <span
                      className="user-icon"
                      onClick={() => {
                        this.setOpenQuickMenu(!openQuickMenu);
                      }}
                    >
                      <i className="fal fa-robot" />
                    </span>
                    <span className="name">{user.name}</span>
                    <span className="email">{user.email}</span>
                  </span>
                  <Button
                    size="sm"
                    className="logout-button float-right g-compact-button"
                    color="primary"
                    onClick={this.logout}
                  >
                    {t('로그아웃')}
                  </Button>
                  <hr className="mb-0" />
                </CardHeader>
                <CardBody className="pt-0">
                  <div className="g-category-label small ">
                    <i className="fal fa-chevron-circle-right" /> QUICK LINK
                  </div>
                  <FormGroup>
                    <div className="mb-1">
                      <Link
                        underline={false}
                        effect={false}
                        componentClassName="px-2"
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          addMessageReducer(
                            0,
                            MESSAGE_CATEGORY.INFO,
                            t('message.waitPlease'),
                            t('message.notImplement'),
                          );
                        }}
                      >
                        <i className="fal fa-sliders-v-square" /> {t('사용자 설정')}
                      </Link>
                    </div>
                    <div className="small px-2">
                      {t('사용자의 아이콘과 사용자별로 특화된 설정을 관리할 수 있습니다,')}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <div className="mb-1">
                      <Link
                        underline={false}
                        effect={false}
                        componentClassName="px-2"
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          addMessageReducer(
                            0,
                            MESSAGE_CATEGORY.INFO,
                            t('message.waitPlease'),
                            t('message.notImplement'),
                          );
                        }}
                      >
                        <i className="fal fa-plus" /> {t('토픽 만들기')}
                      </Link>
                    </div>
                    <div className="small px-2">{t('토픽을 만들고 활용해보세요.')}</div>
                  </FormGroup>
                  <FormGroup>
                    <div className="mb-1">
                      <Link
                        underline={false}
                        effect={false}
                        componentClassName="px-2"
                        to="/"
                        onClick={(e) => {
                          e.preventDefault();
                          addMessageReducer(
                            0,
                            MESSAGE_CATEGORY.INFO,
                            t('message.waitPlease'),
                            t('message.notImplement'),
                          );
                        }}
                      >
                        <i className="fal fa-stars" /> {t('튜토리얼')}
                      </Link>
                    </div>
                    <div className="small px-2">{t('SHAREPLATES를 100% 활용하는 방법에 대해 알아보세요.')}</div>
                  </FormGroup>
                  <hr />
                  <div className="g-category-label small ">
                    <i className="fal fa-chevron-circle-right" /> QUICK CONFIG
                  </div>
                  <FormGroup className="mb-0">
                    <Row>
                      <Col>
                        <span className="small px-2">언어 설정</span>
                      </Col>
                      <Col className="text-right">
                        <div className="g-radio-button language-button d-inline-block">
                          {Object.keys(LANGUAGES)
                            .sort()
                            .reverse()
                            .map((language) => {
                              return (
                                <button
                                  key={language}
                                  type="button"
                                  className={`${i18n.language === language ? 'selected' : ''}`}
                                  onClick={() => {
                                    i18n.changeLanguage(language);
                                  }}
                                >
                                  {t(language)}
                                </button>
                              );
                            })}
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>
                </CardBody>
              </Card>
            </div>
          </>
        )}
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
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
  };
};

Header.propTypes = {
  i18n: PropTypes.objectOf(PropTypes.any),
  t: PropTypes.func,
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
  addMessage: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Header)));
