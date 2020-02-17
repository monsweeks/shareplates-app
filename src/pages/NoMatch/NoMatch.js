import React, {Component} from 'react';
import './NoMatch.css';
import {withRouter} from 'react-router-dom';

class NoMatch extends Component {

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
                404
            </div>
        );
    }
}

export default withRouter(NoMatch);