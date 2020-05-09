import React from 'react';
import PropTypes from 'prop-types';
import './IconViewer.scss';

class IconViewer extends React.PureComponent {
  render() {
    const { index, className, size } = this.props;
    const set = Math.floor(index / 30);
    const serial = index % 30;

    return (
      <div className={`icon-viewer-wrapper ${className} ${size}`}>
        <div className={`img set-${set} serial-${serial}`} />
      </div>
    );
  }
}

IconViewer.defaultProps = {
  className: '',
  index: null,
  size: 'md',
};

IconViewer.propTypes = {
  className: PropTypes.string,
  index: PropTypes.number,
  size: PropTypes.string,
};

export default IconViewer;
