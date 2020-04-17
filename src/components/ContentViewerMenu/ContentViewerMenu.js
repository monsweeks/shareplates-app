import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerMenu.scss';

class ContentViewerMenu extends React.Component {
  chapters = null;

  constructor(props) {
    super(props);
    this.chapters = React.createRef();
  }

  componentDidMount() {
    console.log(this.chapters.current.offsetWidth);
  }

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
          <ul ref={this.chapters}>
            {list &&
              list.map((item, inx) => {
                return (
                  <li
                    key={item.id}
                    className={inx === selectedIndex ? 'selected' : ''}
                    onClick={() => {
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
