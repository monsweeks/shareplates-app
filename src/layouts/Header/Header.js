import React from 'react';
import {withRouter} from 'react-router-dom';
import {NavLink} from "reactstrap";
import './Header.scss';

function Header() {
    return (
        <header className='top-header-wrapper'>
            <div className='menu-area'>
                <NavLink href='/join'>회원가입</NavLink>
                <NavLink href='/sample'>기능 샘플</NavLink>
            </div>
            <div className='logo-area'>
                2
            </div>
            <div className='shortcut-area'>
                3
            </div>

        </header>
    );
}

export default withRouter(Header);