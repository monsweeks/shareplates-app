import React from 'react';
import './DetailLayout.scss';
import PropTypes from 'prop-types';

class DetailLayout extends React.PureComponent {
    render() {
        const { children, className } = this.props;
        return <div className={`detail-layout-wrapper container ${className}`}>{children}</div>;
    }
}

export default DetailLayout;

DetailLayout.defaultProps = {
    className: '',
};

DetailLayout.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
