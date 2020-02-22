import React from 'react';
import { withRouter } from 'react-router-dom';
import './Login.css';

class Login extends React.PureComponent {
  render() {
    return <div className="login-wrapper">로그인</div>;
  }
}

export default withRouter(Login);
