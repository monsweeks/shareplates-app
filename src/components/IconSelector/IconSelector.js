import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { CircleIcon, IconViewer } from '@/components';
import './IconSelector.scss';

const objectImageCount = 36 * 30;
const imageItemWidth = 65;

class IconSelector extends React.Component {
  control = null;

  constructor(props) {
    super(props);
    this.state = {
      imagePagingCount: 0,
      rowCount: 2,
      list: [],
    };

    this.control = React.createRef();
  }

  componentDidMount() {
    const imageColCount = Math.floor(this.control.current.offsetWidth / imageItemWidth);
    const { rowCount } = this.state;
    const list = [];
    for (let i = 0; i < imageColCount * rowCount; i += 1) {
      list.push(i);
    }
    this.setState({
      list,
    });
  }

  moveList = (dir) => {
    const imageColCount = Math.floor(this.control.current.offsetWidth / imageItemWidth);
    const { rowCount, imagePagingCount } = this.state;
    const list = [];
    const unit = imageColCount * rowCount;
    let start = 0;
    let end = 0;

    if (dir === 'prev') {
      if (imagePagingCount < 1) {
        return;
      }

      start = (imagePagingCount - 1) * unit;
      end = imagePagingCount * unit;
    }

    if (dir === 'next') {
      if (objectImageCount < (imagePagingCount + 1) * unit) {
        return;
      }

      start = (imagePagingCount + 1) * unit;
      end = (imagePagingCount + 2) * unit;
      if (end > objectImageCount) {
        end = objectImageCount;
      }
    }

    for (let i = start; i < end; i += 1) {
      list.push(i);
    }

    this.setState({
      imagePagingCount: dir === 'next' ? imagePagingCount + 1 : imagePagingCount - 1,
      list,
    });
  };

  render() {
    const { iconIndex, className, onChange } = this.props;
    const { list } = this.state;

    return (
      <div className={`icon-selector-wrapper g-no-select ${className}`}>
        <div>
          <div className="current-images">
            {iconIndex === null && <div className="image-item no-image" />}
            {iconIndex !== null && (
              <div className="image-item">
                <IconViewer size="lg" index={iconIndex} />
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
              this.moveList('prev');
            }}
          >
            <i className="fal fa-chevron-left" />
          </div>
          <div className="image-list" ref={this.control}>
            {list.map((no) => {
              return (
                <div
                  key={no}
                  className={`image-item ${no === iconIndex ? 'selected' : ''}`}
                  onClick={() => {
                    if (onChange) {
                      onChange(no);
                    }
                  }}
                >
                  <IconViewer size="md" index={no} />
                </div>
              );
            })}
          </div>
          <div
            className="paging next"
            onClick={() => {
              this.moveList('next');
            }}
          >
            <i className="fal fa-chevron-right" />
          </div>
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
