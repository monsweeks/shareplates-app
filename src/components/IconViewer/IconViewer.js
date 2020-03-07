import React from 'react';
import PropTypes from 'prop-types';
import objectIcons from '@/images/objectIcons';
import './IconViewer.scss';

class IconViewer extends React.PureComponent {
  render() {
    const { iconIndex, className, size, circle } = this.props;

    return (
      <div className={`icon-viewer-wrapper ${circle ? 'circle' : ''} ${className} ${size}`}>
        <div className="icon-image">
          {iconIndex === null && <div className="image-item no-image" />}
          {iconIndex !== null && (
            <div className="image-item">
              <img src={objectIcons[iconIndex]} alt="" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

IconViewer.defaultProps = {
  className: '',
  size: 'md',
  circle: false,
};

IconViewer.propTypes = {
  className: PropTypes.string,
  iconIndex: PropTypes.number,
  size: PropTypes.string,
  circle : PropTypes.bool,
};

export default IconViewer;
