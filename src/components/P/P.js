import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './P.scss';

class P extends React.PureComponent {
  render() {
    const { className, children, upppercase, pre } = this.props;

    return (
      <p className={`p-wrapper ${className} ${upppercase ? 'text-uppercase' : ''} ${pre ? 'pre' : ''}`}>{children}</p>
    );
  }
}

P.defaultProps = {
  className: '',
  upppercase: false,
  pre: false,
};

P.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  upppercase: PropTypes.bool,
  pre: PropTypes.bool,
};

export default withTranslation()(P);
