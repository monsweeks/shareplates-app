import React, {Component} from 'react';
import './Join.css';
import {withRouter} from 'react-router-dom';

class Join extends Component {

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
                <h1>가</h1>
                <span>가</span>
                <span className="font-weight-bold">가</span>
            </div>
        );
    }
}

export default withRouter(Join);