import React from 'react';
import {withRouter} from 'react-router-dom';
import {Link} from "react-router-dom";
import {Logo} from "components";
import {withTranslation} from "react-i18next";
import './Header.scss';
import LANGUAGES from "../../languages/languages";

class Header extends React.PureComponent {

    render() {

        const {t, i18n} = this.props;

        return (
            <header className='top-header-wrapper'>
                <div className='menu-area'>
                    <Link to='/join'>
                        <div className='screen screen-1'/>
                        <div className='screen screen-2'/>
                        <div className='screen screen-3'/>
                        <div className='screen screen-4'/>
                        <div className='icon'><span><i className="fal fa-books"/></span></div>
                        <div className='text'><span>{t('label.topic')}</span></div>
                    </Link>
                    <Link to='/sample'>
                        <div className='screen screen-1'/>
                        <div className='screen screen-2'/>
                        <div className='screen screen-3'/>
                        <div className='screen screen-4'/>
                        <div className='icon'><span><i className="fal fa-book"/></span></div>
                        <div className='text'><span>{t('label.chapter')}</span></div>
                    </Link>
                    <Link to='/sample'>
                        <div className='screen screen-1'/>
                        <div className='screen screen-2'/>
                        <div className='screen screen-3'/>
                        <div className='screen screen-4'/>
                        <div className='icon'><span><i className="fal fa-clipboard"/></span></div>
                        <div className='text'><span>{t('label.page')}</span></div>
                    </Link>
                </div>
                <div className='logo-area'>
                    <Logo/>
                </div>
                <div className='shortcut-area'>
                    <div className='radio-button'>
                        {Object.keys(LANGUAGES).sort().reverse().map((language) => {
                            return <button key={language} type='button'
                                           className={`${i18n["language"] === language ? 'selected' : ''}`}
                                           onClick={() => {
                                               i18n.changeLanguage(language);
                                           }}>{t(language)}</button>
                        })}
                    </div>

                </div>
            </header>
        );
    }
}

export default withRouter(withTranslation()(Header));