import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerMenu.scss';

class ContentViewerMenu extends React.Component {
  listControl = null;

  selectedControl = null;

  startPageX = null;

  currentLeft = 0;

  moved = false;

  lastFirstItemId = null;

  resizeTimer = null;

  constructor(props) {
    super(props);
    this.listControl = React.createRef();
    this.selectedControl = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate() {
    const { list } = this.props;
    if (list && list.length > 0) {
      if (this.lastFirstItemId !== list[0].id) {
        this.listControl.current.style.left = '0px';
      }
      this.lastFirstItemId = list[0].id;
    } else {
      this.lastFirstItemId = null;
      this.listControl.current.style.left = '0px';
    }
  }

  onResize = () => {
    if (this.resizeTimer != null) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
    this.resizeTimer = setTimeout(this.checkMenuPosition, 100);
  };

  checkMenuPosition = () => {
    const parentWidth = this.listControl.current.parentNode.offsetWidth;
    const listWidth = this.listControl.current.offsetWidth;
    if (parentWidth > listWidth) {
      this.currentLeft = 0;
      this.listControl.current.style.left = '0px';
    }
  };

  onMouseDown = (e) => {
    const parentWidth = this.listControl.current.parentNode.offsetWidth;
    const listWidth = this.listControl.current.offsetWidth;
    if (parentWidth < listWidth) {
      this.startPageX = e.pageX;
    } else {
      this.startPageX = null;
    }
  };

  onMouseMove = (e) => {
    if (this.startPageX === null) {
      return;
    }

    const nextLeft = this.currentLeft + (e.pageX - this.startPageX);
    const parentWidth = this.listControl.current.parentNode.offsetWidth;
    const maxLeft = -(this.listControl.current.offsetWidth - parentWidth);

    if (nextLeft > 0) {
      this.listControl.current.style.left = '0px';
    } else if (nextLeft < maxLeft) {
      this.listControl.current.style.left = `${maxLeft}px`;
    } else {
      this.listControl.current.style.left = `${this.currentLeft + (e.pageX - this.startPageX)}px`;
    }
  };

  onMouseUp = (e) => {
    if (this.startPageX === null) {
      return;
    }

    const nextLeft = this.currentLeft + (e.pageX - this.startPageX);
    const parentWidth = this.listControl.current.parentNode.offsetWidth;
    const maxLeft = -(this.listControl.current.offsetWidth - parentWidth);

    if (this.currentLeft !== nextLeft) {
      if (nextLeft > 0) {
        this.currentLeft = nextLeft;
        this.moved = true;
        this.listControl.current.style.left = '0px';
      } else if (nextLeft < maxLeft) {
        this.currentLeft = maxLeft;
        this.moved = true;
        this.listControl.current.style.left = `${maxLeft}px`;
      } else {
        this.currentLeft = nextLeft;
        this.moved = true;
        this.listControl.current.style.left = `${this.currentLeft}px`;
      }
    }
    this.startPageX = null;
    setTimeout(() => {
      if (this.moved) {
        this.moved = false;
      }
    }, 100);
  };

  render() {
    const { className, list, selectedId, onClick, onPrevClick, onNextClick } = this.props;
    const selectedIndex = list.findIndex((item) => item.id === selectedId);
    const prevButtonEnabled = selectedIndex > 0;
    const nextButtonEnabled = selectedIndex < list.length - 1;

    return (
      <div className={`content-viewer-menu-wrapper ${className}`}>
        <div className="move-arrow">
          <span
            className={prevButtonEnabled ? 'enabled' : 'disabled'}
            onClick={() => {
              if (prevButtonEnabled) {
                onPrevClick(list[selectedIndex - 1].id);
              }
            }}
          >
            <i className="fal fa-chevron-left" />
          </span>
        </div>
        <div className="content">
          <ul
            ref={this.listControl}
            onMouseDown={this.onMouseDown}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
            onMouseLeave={this.onMouseUp}
            onClick={() => {
              if (this.moved) {
                this.moved = false;
              }
            }}
          >
            {list &&
              list.map((item, inx) => {
                return (
                  <li
                    key={item.id}
                    className={inx === selectedIndex ? 'selected' : ''}
                    ref={inx === selectedIndex ? this.selectedControl : null}
                    onClick={() => {
                      if (this.moved) {
                        this.moved = false;
                        return;
                      }
                      onClick(item.id);
                    }}
                  >
                    <div>{item.title}</div>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="move-arrow">
          <span
            className={nextButtonEnabled ? 'enabled' : 'disabled'}
            onClick={() => {
              if (nextButtonEnabled) {
                onNextClick(list[selectedIndex + 1].id);
              }
            }}
          >
            <i className="fal fa-chevron-right" />
          </span>
        </div>
      </div>
    );
  }
}

ContentViewerMenu.defaultProps = {
  className: '',
};

ContentViewerMenu.propTypes = {
  className: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
  ),
  selectedId: PropTypes.number,
  onClick: PropTypes.func,
  onPrevClick: PropTypes.func,
  onNextClick: PropTypes.func,
};

export default withRouter(withTranslation()(ContentViewerMenu));
