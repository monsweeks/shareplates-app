import React, {Component} from 'react';
import './RegisterLayout.scss';

class RegisterLayout extends Component {

    render() {
        return (
            <div className="register-layout-wrapper">
                {this.props.children}
            </div>
        );
    }
}

export default RegisterLayout;