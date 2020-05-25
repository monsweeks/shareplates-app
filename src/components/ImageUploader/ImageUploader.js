import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components';
import './ImageUploader.scss';

class ImageUploader extends React.Component {
  fileInput = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
    };
  }

  onDragOver = (e) => {
    const { dragging } = this.state;
    e.stopPropagation();
    e.preventDefault();

    if (!dragging) {
      this.setState({
        dragging: true,
      });
    }
  };

  onDragLeave = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      dragging: false,
    });
  };

  onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { onChangeFile } = this.props;
    if (e.dataTransfer.files.length > 0) {
      onChangeFile(e.dataTransfer.files[0]);
    }
  };

  render() {
    const { className, onChangeFile } = this.props;
    const { dragging } = this.state;

    return (
      <div className={`image-upload-wrapper ${className}`}>
        <div>
          <div
            className={`image-selector ${dragging ? 'dragging' : ''}`}
            onDragOver={this.onDragOver}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
          >
            <div>
              <input
                ref={this.fileInput}
                type="file"
                className="d-none"
                onChange={() => {
                  if (this.fileInput.current.files.length > 0) {
                    onChangeFile(this.fileInput.current.files[0]);
                  }
                }}
              />
              <Button
                className="image-select-button"
                size="sm"
                color="primary"
                onClick={() => {
                  this.fileInput.current.click();
                }}
              >
                파일 선택
              </Button>
              <div className="message">위 버튼을 클릭하여, 이미지 파일을 선택하거나, 여기로 파일을 드래그해주세요</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ImageUploader.defaultProps = {
  className: '',
};

ImageUploader.propTypes = {
  className: PropTypes.string,
  onChangeFile: PropTypes.func,
};

export default ImageUploader;
