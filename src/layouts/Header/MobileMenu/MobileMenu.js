import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Link, RadioButton, TopLogo } from 'components';
import { withTranslation } from 'react-i18next';
import LANGUAGES from '@/languages/languages';
import './MobileMenu.scss';

class MobileMenu extends React.PureComponent {
  getMenuClass = (openMenu) => {
    if (openMenu === null) {
      return '';
    }

    if (openMenu) {
      return 'menu-open';
    }

    return 'menu-close';
  };

  render() {
    const { t, menus, openMenu, ready, loggedIn, onChangeLanguage, language, setOpen, activePropsKeys } = this.props;

    return (
      <div className="mobile-menu-wrapper">
        {openMenu && (
          <div
            className="overlay d-md-none"
            onClick={() => {
              setOpen(false);
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
                  setOpen(false);
                }}
              >
                <i className="fal fa-times h5 font-weight-lighter m-0" />
              </Button>
            </div>
            <div className="menu-list">
              <ul>
                {menus.map((menu) => {
                  const enabled = !!(
                    !menu.activePropsKey ||
                    (menu.activePropsKey && activePropsKeys[menu.activePropsKey])
                  );

                  return (
                    <li key={menu.text}>
                      <Link
                        underline={false}
                        className={`d-inline-block menu-item ${enabled ? 'en' : 'dis'}`}
                        onClick={(e) => {
                          if (enabled) {
                            setOpen(false);
                          } else {
                            e.stopPropagation();
                            e.preventDefault();
                          }
                        }}
                        to={menu.to}
                        enabled={enabled}
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
                    setOpen(false);
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
                  <RadioButton
                    items={Object.keys(LANGUAGES)
                      .sort()
                      .reverse()
                      .map((d) => {
                        return {
                          key: d,
                          value: t(d),
                        };
                      })}
                    value={language}
                    onClick={onChangeLanguage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MobileMenu.propTypes = {
  t: PropTypes.func,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      text: PropTypes.string,
      to: PropTypes.string,
      activePropsKey: PropTypes.string,
    }),
  ),
  openMenu: PropTypes.bool,
  setOpen: PropTypes.func,
  ready: PropTypes.bool,
  loggedIn: PropTypes.bool,
  onChangeLanguage: PropTypes.func,
  language: PropTypes.string,
  activePropsKeys: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(withTranslation()(MobileMenu));
