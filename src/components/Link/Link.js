import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import './Link.scss';
import PropTypes from 'prop-types';

class Link extends React.PureComponent {
    render() {
        const { color, className, componentClassName, underline, ...last } = this.props;

        return (
            <span className={`link-wrapper text-${color} ${className} ${underline ? 'underline' : ''}`}>
                <RouterLink className={`text-${color} ${componentClassName}`} {...last} />
                {underline && <div className="liner" />}
            </span>
        );
    }
}

Link.defaultProps = {
    underline: true,
    className: '',
    color: 'white',
    componentClassName: '',
};

Link.propTypes = {
    underline: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.string,
    componentClassName: PropTypes.string,
};

export default Link;

Link.propTypes = {
    i18n: PropTypes.objectOf(PropTypes.any),
    t: PropTypes.func,
};
