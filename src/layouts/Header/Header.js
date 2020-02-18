import React from 'react';
import {withRouter} from 'react-router-dom';
import {NavLink} from "reactstrap";
import {Logo} from "components";
import {withTranslation} from "react-i18next";
import './Header.scss';

class Header extends React.PureComponent {

    render() {

        const {t} = this.props;

        return (
            <header className='top-header-wrapper'>
                <div className='menu-area'>
                    <NavLink href='/join'>
                        <div className='screen screen-1'/>
                        <div className='screen screen-2'/>
                        <div className='screen screen-3'/>
                        <div className='screen screen-4'/>
                        <div className='icon'><span><i className="fal fa-books"/></span></div>
                        <div className='text'><span>{t('label.topic')}</span></div>
                    </NavLink>
                    <NavLink href='/sample'>
                        <div className='screen screen-1'/>
                        <div className='screen screen-2'/>
                        <div className='screen screen-3'/>
                        <div className='screen screen-4'/>
                        <div className='icon'><span><i className="fal fa-book"/></span></div>
                        <div className='text'><span>{t('label.chapter')}</span></div>
                    </NavLink>
                    <NavLink href='/sample'>
                        <div className='screen screen-1'/>
                        <div className='screen screen-2'/>
                        <div className='screen screen-3'/>
                        <div className='screen screen-4'/>
                        <div className='icon'><span><i className="fal fa-clipboard"/></span></div>
                        <div className='text'><span>{t('label.page')}</span></div>
                    </NavLink>
                </div>
                <div className='logo-area'>
                    <Logo/>
                </div>
                <div className='shortcut-area'>

                </div>
            </header>
        );
    }
}

export default withRouter(withTranslation()(Header));