import React from 'react';
import PropTypes from 'prop-types';
import './Temp.scss';

class Temp extends React.PureComponent {
  render() {
    const { className } = this.props;

    return (
      <div className={`text-wrapper ${className}`}>
        <div>1</div>
      </div>
    );
  }
}

Temp.defaultProps = {
  className: '',
};

Temp.propTypes = {
  className: PropTypes.string,
};

export default Temp;
