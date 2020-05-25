import React from 'react';
import PropTypes from 'prop-types';
import './ImageBuilder.scss';
import ImageUploader from '@/components/ImageUploader/ImageUploader';
import request from '@/utils/request';

class ImageBuilder extends React.PureComponent {
  render() {
    const { className, onChangeFile, info } = this.props;
    const hasImage = info && info.icon && info.icon.type === 'image';

    return (
      <article className={`image-builder-wrapper g-no-select ${className}`}>
        <div className="preview-box">
          <div className="preview-image">
            {hasImage && <img src={`${request.getBase()}/files/${info.icon.data.id}?uuid=${info.icon.data.uuid}`} alt="" />}
          </div>
        </div>
        <div className="controller">
          <ImageUploader onChangeFile={onChangeFile} />
        </div>
      </article>
    );
  }
}
export default ImageBuilder;

ImageBuilder.defaultProps = {
  className: '',
};

ImageBuilder.propTypes = {
  onChangeFile: PropTypes.func,
  className: PropTypes.string,
  info: PropTypes.shape({
    icon: PropTypes.shape({
      type: PropTypes.string,
      data: PropTypes.objectOf(PropTypes.any),
    }),
  }),
};
