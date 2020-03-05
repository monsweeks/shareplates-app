import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './P.scss';

class P extends React.PureComponent {
  render() {
    const { className, value } = this.props;

    return <p className={`p-wrapper ${className}`}>{value}</p>;
  }
}

P.defaultProps = {
  className: '',
  value: '',
};

P.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
};

export default withTranslation()(P);
