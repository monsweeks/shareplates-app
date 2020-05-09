import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button } from '@/components';
import storage from '@/utils/storage';
import './ShareSidePopup.scss';

class ShareSidePopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      position: 'popup',
    };
  }

  componentDidMount() {
    const { name } = this.props;
    const position = storage.getItem('shares', name);
    if (position) {
      this.setState({
        position,
      });
    }

    window.dispatchEvent(new Event('resize'));
  }

  setPosition = (position) => {
    this.setState(
      {
        position,
      },
      () => {
        window.dispatchEvent(new Event('resize'));
      },
    );

    const { name } = this.props;
    storage.setItem('shares', name, position);
  };

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
                  className={position === 'pin' ? 'selected' : ''}
                  color="white"
                  onClick={() => {
                    this.setPosition('pin');
                  }}
                >
                  <i className="fal fa-thumbtack" />
                </Button>
                <Button
                  className={position === 'popup' ? 'selected' : ''}
                  color="white"
                  onClick={() => {
                    this.setPosition('popup');
                  }}
                >
                  <i className="fal fa-window-alt" />
                </Button>
                <Button
                  className={position === 'max' ? 'selected' : ''}
                  color="white"
                  onClick={() => {
                    this.setPosition('max');
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

ShareSidePopup.defaultProps = {
  className: '',
  arrowRight: '',
  title: '',
};

ShareSidePopup.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  setOpen: PropTypes.func,
  arrowRight: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default withRouter(withTranslation()(ShareSidePopup));
