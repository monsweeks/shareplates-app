import React, {Component} from 'react';
import './Login.css';
import {withRouter} from 'react-router-dom';
import Join from "pages/Join/Join";

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            control: {
                id: "",
                password: "",
                message: null
            }
        };
    }


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