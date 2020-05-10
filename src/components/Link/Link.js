import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Link.scss';

class Link extends React.PureComponent {
  render() {
    const { enabled, color, className, componentClassName, underline, effect, ...last } = this.props;

    return (
      <span
        className={`link-wrapper ${enabled ? '' : 'disabled'} text-${color} ${className} ${
          underline ? 'underline' : ''
        }`}
      >
        <RouterLink
          onClick={(e) => {
            if (!enabled) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
          className={`text-${color} ${componentClassName}`}
          {...last}
        />
        {underline && <span className="underline" />}
        {effect && <span className="liner" />}
      </span>
    );
  }
}

Link.defaultProps = {
  underline: false,
  className: '',
  color: 'blue',
  componentClassName: '',
  effect: true,
  enabled: true,
};

Link.propTypes = {
  underline: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string,
  componentClassName: PropTypes.string,
  effect: PropTypes.bool,
  enabled: PropTypes.bool,
};

export default Link;
