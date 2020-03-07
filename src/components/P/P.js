import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './P.scss';

class P extends React.PureComponent {
  render() {
    const { className, value, upppercase, pre } = this.props;

    return <p className={`p-wrapper ${className} ${upppercase ? 'text-uppercase' : ''} ${pre ? 'pre' : ''}`}>{value}</p>;
  }
}

P.defaultProps = {
  className: '',
  value: '',
  upppercase : false,
  pre : false,
};

P.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  upppercase : PropTypes.bool,
  pre : PropTypes.bool,
};

export default withTranslation()(P);
