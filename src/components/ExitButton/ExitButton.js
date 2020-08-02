import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ExitButton.scss';

class ExitButton extends React.PureComponent {
  render() {
    const { className, size, color, onClick } = this.props;

    return (
      <div
        className={`${className} color-${color} exit-button-wrapper`}
        style={{
          width: size,
          height: size,
        }}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        <div
          className="x-1"
          style={{
            borderColor: color,
          }}
        />
        <div
          className="x-2"
          style={{
            borderColor: color,
          }}
        />
      </div>
    );
  }
}

ExitButton.defaultProps = {
  className: '',
  size: '16px',
  color: 'white',
};

ExitButton.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default withRouter(withTranslation()(ExitButton));
