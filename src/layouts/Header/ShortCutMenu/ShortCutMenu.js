import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { CircleIcon, Link, RadioButton, UserIcon } from '@/components';
import LANGUAGES from '@/languages/languages';
import './ShortCutMenu.scss';
import { UserPropTypes } from '@/proptypes';

class ShortCutMenu extends React.PureComponent {
  render() {
    const {
      className,
      setOpenQuickMenu,
      openQuickMenu,
      ready,
      loggedIn,
      t,
      language,
      onChangeLanguage,
      user,
    } = this.props;

    return (
      <div className={`short-cut-menu-wrapper ${className}`}>
        <div>
          <CircleIcon
            className={ready && loggedIn ? 'd-inline-block mx-2' : 'd-none'}
            icon={<i className="fal fa-bell" />}
            onClick={() => {}}
          />
        </div>
        <div className={ready && loggedIn ? 'd-block' : 'd-none'}>
          {user && user.info && (
            <div
              className="user-icon"
              onClick={() => {
                setOpenQuickMenu(!openQuickMenu);
              }}
            >
              <div className="hover-item" />
              {user && <UserIcon info={user.info} />}
              {user.isAdmin && (
                <div className="superman-mark">
                  <i className="fad fa-medal" />
                </div>
              )}
            </div>
          )}
          {!(user && user.info) && (
            <CircleIcon
              className="d-inline-block mx-1"
              icon={<i className="fal fa-robot" />}
              onClick={() => {
                setOpenQuickMenu(!openQuickMenu);
              }}
            />
          )}
        </div>
        <div className={ready && !loggedIn ? 'no-login-menu d-inline-block' : 'd-none'}>
          <Link
            className="login-label d-inline-block"
            underline={false}
            componentClassName="mr-3 mr-md-0 p-0 px-md-2"
            color="white"
            to="/users/login"
            effect={false}
          >
            {t('label.login')}
          </Link>
          <div className="separator d-none d-md-inline-block" />
          <RadioButton
            className="language-button d-none d-md-inline-block"
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
      </div>
    );
  }
}

export default withRouter(withTranslation()(ShortCutMenu));

ShortCutMenu.defaultProps = {
  className: '',
};

ShortCutMenu.propTypes = {
  t: PropTypes.func,
  setOpenQuickMenu: PropTypes.func,
  openQuickMenu: PropTypes.bool,
  className: PropTypes.string,
  ready: PropTypes.bool,
  loggedIn: PropTypes.bool,
  language: PropTypes.string,
  onChangeLanguage: PropTypes.func,
  user: UserPropTypes,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
