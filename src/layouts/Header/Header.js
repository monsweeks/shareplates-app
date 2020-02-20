import React from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Logo, Link} from "components";
import {withTranslation} from "react-i18next";
import './Header.scss';
import LANGUAGES from "../../languages/languages";
import {connect} from "react-redux";

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

        const {t, i18n, user} = this.props;
        const {open} = this.state;

        console.log(user);

        return (
            <header className='top-header-wrapper'>
                <div className='menu-area text-left text-md-center d-flex d-md-block pl-2 pl-md-0'>
                    <Button className='d-inline-block d-md-none align-self-center' color='primary' onClick={() => {
                        this.setOpen(!open);
                    }}>
                        <i className="fas fa-bars"/>
                    </Button>
                    {menus.map((menu) => {
                        return <Link underline={false} key={menu.text} className='d-none d-md-inline-block menu-item' to={menu.to}>
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
                    <Logo weatherEffect/>
                </div>
                <div className='shortcut-area'>
                    {!user && <Link className='d-none d-md-inline-block' componentClassName='px-2' color='white' to='/join'>
                        {t('label.memberJoin')}
                    </Link>}
                    <div className='separator d-none d-md-inline-block'/>
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
                            <Logo weatherEffect/>
                            <Button color='secondary' className='close-button shadow-none bg-transparent border-0' onClick={() => {
                                this.setOpen(false);
                            }}>
                                <i className="fal fa-times h5 font-weight-lighter m-0"></i>
                            </Button>
                        </div>
                        <div className='menu-list'>
                            <ul>
                                {menus.map((menu) => {
                                    return <li key={menu.text}>
                                        <Link underline={false} className='d-inline-block menu-item' onClick={() => {
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
                        <div className='link-area'>
                            {!user && <Link componentClassName='px-2' color='blue' to='/join' onClick={() => {
                                this.setOpen(false);
                            }}>
                                {t('label.memberJoin')}
                            </Link>}
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


let mapStateToProps = (state) => {
    return {
        user: state.user.user,
    };
};

Header = connect(mapStateToProps, undefined)(Header);

export default withRouter(withTranslation()(Header));