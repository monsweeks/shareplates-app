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
                가
            </div>
        );
    }
}

export default withRouter(Join);