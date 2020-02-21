import React from 'react';
import './RegisterLayout.scss';
import PropTypes from 'prop-types';

class RegisterLayout extends React.PureComponent {
    render() {
        const { children, className } = this.props;
        return <div className={`register-layout-wrapper container ${className}`}>{children}</div>;
    }
}

export default RegisterLayout;

RegisterLayout.defaultProps = {
    className: '',
};

RegisterLayout.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
