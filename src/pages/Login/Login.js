import React from 'react';
import { withRouter } from 'react-router-dom';
import Join from '@/pages/Join/Join';
import './Login.css';

class Login extends React.PureComponent {
    render() {
        return (
            <div className="login-wrapper">
                로그인
                <Join />
            </div>
        );
    }
}

export default withRouter(Login);
