import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './DetailValue.scss';

class DetailValue extends React.PureComponent {
  render() {
    const { className, children, upppercase, pre, bold, border, uppercase } = this.props;

    return (
      <div className={`detail-value-wrapper ${className} ${uppercase ? 'uppercase' : ''} ${border ? 'has-border' : ''} ${bold ? 'bold' : ''} ${upppercase ? 'text-uppercase' : ''} ${pre ? 'pre' : ''}`}><div>{children}</div></div>
    );
  }
}

DetailValue.defaultProps = {
  className: '',
  upppercase: false,
  pre: false,
  bold : true,
  border : true,
  uppercase : false,
};

DetailValue.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  upppercase: PropTypes.bool,
  pre: PropTypes.bool,
  bold : PropTypes.bool,
  border : PropTypes.bool,
  uppercase : PropTypes.bool,
};

export default withTranslation()(DetailValue);
