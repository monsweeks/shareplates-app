import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './IconSelector.scss';
import { CircleIcon } from '@/components';
import objectIcons from '@/images/objectIcons';

class IconSelector extends React.Component {
  control = null;

  constructor(props) {
    super(props);
    this.state = {
      imageRowCount: 16,
      imagePagingCount: 0,
      rowCount: 2,
    };

    this.control = React.createRef();
  }

  componentDidMount() {
    this.setState({
      imageRowCount: Math.floor(this.control.current.offsetWidth / 55),
    });
  }

  render() {
    const { iconIndex, className, onChange } = this.props;
    const { imageRowCount, imagePagingCount, rowCount } = this.state;

    return (
      <div className={`icon-selector-wrapper g-no-select ${className}`}>
        <div>
          <div className="current-images">
            {iconIndex === null && <div className="image-item no-image" />}
            {iconIndex !== null && (
              <div className="image-item">
                <img src={objectIcons[iconIndex]} alt="" />
              </div>
            )}
            <div className="clear-image">
              <CircleIcon
                color="danger"
                className="close-popup-button"
                icon={<i className="fal fa-times" />}
                onClick={() => {
                  if (onChange) {
                    onChange(null);
                  }
                }}
              />
            </div>
          </div>
          <div
            className="paging prev"
            onClick={() => {
              if (imagePagingCount >= 1) {
                this.setState({
                  imagePagingCount: imagePagingCount - 1,
                });
              }
            }}
          >
            <i className="fal fa-chevron-left" />
          </div>
          <div className="image-list" ref={this.control}>
            {objectIcons
              .filter((image, inx) => {
                if (
                  inx > imageRowCount * rowCount * imagePagingCount - 1 &&
                  inx < imageRowCount * rowCount * (imagePagingCount + 1)
                ) {
                  return true;
                }

                return false;
              })
              .map((image, inx) => {
                return (
                  <div
                    key={inx}
                    className={`image-item ${
                      imageRowCount * rowCount * imagePagingCount + inx === iconIndex ? 'selected' : ''
                    }`}
                    onClick={() => {
                      if (onChange) {
                        onChange(imageRowCount * rowCount * imagePagingCount + inx);
                      }
                    }}
                  >
                    <img src={image} alt="" />
                  </div>
                );
              })}
          </div>
          <div
            className="paging next"
            onClick={() => {
              if (objectIcons.length > imageRowCount * rowCount * (imagePagingCount + 1)) {
                this.setState({
                  imagePagingCount: imagePagingCount + 1,
                });
              }
            }}
          >
            <i className="fal fa-chevron-right" />
          </div>
        </div>
        <div className="small text-uppercase text-right w-100 d-none">
          ICON FROM
          <a href="https://www.flaticon.com/kr/authors/wissawa-khamsriwath" title="Wissawa Khamsriwath">
            Wissawa Khamsriwath
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/kr/" title="Flaticon">
            {' '}
            www.flaticon.com
          </a>
        </div>
      </div>
    );
  }
}

IconSelector.defaultProps = {
  className: '',
};

IconSelector.propTypes = {
  className: PropTypes.string,
  iconIndex: PropTypes.number,
  onChange: PropTypes.func,
};

export default withTranslation()(IconSelector);
