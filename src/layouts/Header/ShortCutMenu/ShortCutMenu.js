import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import CircleIcon from '@/components/CircleIcon/CircleIcon';
import { Link } from '@/components';
import RadioButton from '@/components/RadioButton/RadioButton';
import LANGUAGES from '@/languages/languages';
import './ShortCutMenu.scss';
import SearchInput from '@/components/SearchInput/SearchInput';

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
      onSearch,
    } = this.props;
    return (
      <div className={`short-cut-menu-wrapper ${className}`}>
        <div>
          <SearchInput className='d-none' onSearch={onSearch} />
        </div>
        <div>
          <CircleIcon
            className={ready && loggedIn ? 'd-inline-block mx-1' : 'd-none'}
            icon={<i className="fal fa-bell" />}
            onClick={() => {}}
          />
        </div>
        <div>
          <CircleIcon
            className={ready && loggedIn ? 'd-inline-block mx-1' : 'd-none'}
            icon={<i className="fal fa-robot" />}
            onClick={() => {
              setOpenQuickMenu(!openQuickMenu);
            }}
          />
        </div>
        <div className={ready && !loggedIn ? 'd-inline-block' : 'd-none'}>
          <Link
            className="d-inline-block"
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

export default withTranslation()(ShortCutMenu);

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
  onSearch : PropTypes.func,
};
