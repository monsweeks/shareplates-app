import React from 'react';
import PropTypes from 'prop-types';
import './ObjectImage.scss';

class ObjectImage extends React.PureComponent {
  render() {
    const { index, className, size } = this.props;
    const set = Math.floor(index / 30);
    const serial = index % 30;

    return (
      <div className={`object-image-wrapper ${className} ${size}`}>
        <div className={`img set-${set} serial-${serial}`} />
      </div>
    );
  }
}

ObjectImage.defaultProps = {
  className: '',
  index: null,
  size: 'md',
};

ObjectImage.propTypes = {
  className: PropTypes.string,
  index: PropTypes.number,
  size: PropTypes.string,
};

export default ObjectImage;
