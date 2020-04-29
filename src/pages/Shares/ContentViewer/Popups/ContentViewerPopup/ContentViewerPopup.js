import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ContentViewerPopup.scss';
import { Button } from '@/components';

class ContentViewerPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 'popup',
    };
  }

  render() {
    const { className, setOpen, children, arrowRight, title } = this.props;
    const { position } = this.state;

    const childrenWithProps = React.Children.map(
      Array.isArray(children) ? children.filter((d) => d) : children,
      (child) =>
        React.cloneElement(child, {
          position,
        }),
    );

    return (
      <div className={`content-viewer-popup-wrapper ${className} ${position}`}>
        <div>
          <div>
            <div className="arrow">
              <div style={{ right: arrowRight }} />
            </div>
            <div className="title">
              {title}
              <div className="position-buttons">
                <Button
                  color="white"
                  onClick={() => {
                    this.setState({
                      position: 'pin',
                    });
                  }}
                >
                  <i className="fal fa-thumbtack" />
                </Button>
                <Button
                  color="white"
                  onClick={() => {
                    this.setState({
                      position: 'popup',
                    });
                  }}
                >
                  <i className="fal fa-window-minimize" />
                </Button>
                <Button
                  color="white"
                  onClick={() => {
                    this.setState({
                      position: 'max',
                    });
                  }}
                >
                  <i className="fal fa-window-maximize" />
                </Button>
                <Button
                  color="white"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <i className="fal fa-times" />
                </Button>
              </div>
            </div>
            <div className="popup-content scrollbar">{childrenWithProps}</div>
          </div>
        </div>
      </div>
    );
  }
}

ContentViewerPopup.defaultProps = {
  className: '',
  arrowRight: '',
  title: '',
};

ContentViewerPopup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  setOpen: PropTypes.func,
  arrowRight: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default withRouter(withTranslation()(ContentViewerPopup));
