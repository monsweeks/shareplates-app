import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, Logo} from "components";
import {withTranslation} from "react-i18next";
import './Header.scss';
import LANGUAGES from "../../languages/languages";

const menus = [
    {
        icon: 'fal fa-books',
        text: 'label.topic',
        to: '/topic',
    },
    {
        icon: 'fal fa-book',
        text: 'label.chapter',
        to: '/chapter',
    },
    {
        icon: 'fal fa-clipboard',
        text: 'label.page',
        to: '/page',
    }
];

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: null
        };
    }

    setOpen = (open) => {
        this.setState({
            open
        });
    };


    render() {

        const {t, i18n} = this.props;
        const {open} = this.state;

        return (
            <header className='top-header-wrapper'>
                <div className='menu-area text-left text-md-center d-flex d-md-block pl-2 pl-md-0'>
                    <Button className='d-inline-block d-md-none align-self-center' color='primary' onClick={() => {
                        this.setOpen(!open);
                    }}>
                        <i className="fas fa-bars"/>
                    </Button>
                    {menus.map((menu) => {
                        return <Link className='d-none d-md-inline-block' to={menu.to}>
                            <div className='screen screen-1'/>
                            <div className='screen screen-2'/>
                            <div className='screen screen-3'/>
                            <div className='screen screen-4'/>
                            <div className='icon'><span><i className={menu.icon}/></span></div>
                            <div className='text'><span>{t(menu.text)}</span></div>
                        </Link>
                    })}
                </div>
                <div className='logo-area'>
                    <Logo/>
                </div>
                <div className='shortcut-area'>
                    <div className='override-radio-button language-button d-none d-md-inline-block'>
                        {Object.keys(LANGUAGES).sort().reverse().map((language) => {
                            return <button key={language} type='button'
                                           className={`${i18n["language"] === language ? 'selected' : ''}`}
                                           onClick={() => {
                                               i18n.changeLanguage(language);
                                           }}>{t(language)}</button>
                        })}
                    </div>
                </div>
                {open && <div className='overlay d-md-none' onClick={() => {
                    this.setOpen(false);
                }}/>}
                <div
                    className={`mobile-menu-area d-md-none ${open === null ? '' : (open ? 'menu-open' : 'menu-close')}`}>
                    <div>
                        <div className='top'>
                            <Logo/>
                            <Button color='secondary' className='close-button shadow-none bg-transparent border-0' onClick={() => {
                                this.setOpen(false);
                            }}>
                                <i className="fal fa-times h5 font-weight-lighter m-0"></i>
                            </Button>
                        </div>
                        <div className='menu-list'>
                            <ul>
                                {menus.map((menu) => {
                                    return <li>
                                        <Link className='d-inline-block' onClick={() => {
                                            this.setOpen(false);
                                        }} to={menu.to}>
                                            <div className='icon'><span><i className={menu.icon}/></span></div>
                                            <div className='text'><span>{t(menu.text)}</span></div>
                                            <span className='arrow'><i className="fal fa-chevron-right"/></span>
                                        </Link>
                                    </li>
                                })}
                            </ul>
                        </div>
                        <div className='shortcut-area'>
                            <div>
                                <label>언어 설정</label>
                                <div className='override-radio-button'>
                                    {Object.keys(LANGUAGES).sort().reverse().map((language) => {
                                        return <button key={language} type='button'
                                                       className={`${i18n["language"] === language ? 'selected' : ''}`}
                                                       onClick={() => {
                                                           i18n.changeLanguage(language);
                                                       }}>{t(language)}</button>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </header>
        );
    }
}

export default withRouter(withTranslation()(Header));