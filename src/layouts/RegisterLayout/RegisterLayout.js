import React from 'react';
import './RegisterLayout.scss';
import PropTypes from 'prop-types';

class RegisterLayout extends React.PureComponent {
    render() {
        const { children } = this.props;
        return <div className="register-layout-wrapper">{children}</div>;
    }
}

export default RegisterLayout;

RegisterLayout.propTypes = {
    children: PropTypes.node,
};
