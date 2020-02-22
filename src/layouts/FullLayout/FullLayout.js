import React from 'react';
import PropTypes from 'prop-types';
import './FullLayout.scss';

class FullLayout extends React.PureComponent {
    render() {
        const { children, className } = this.props;
        return <div className={`full-layout-wrapper ${className}`}>{children}</div>;
    }
}

export default FullLayout;

FullLayout.defaultProps = {
    className: '',
};

FullLayout.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
