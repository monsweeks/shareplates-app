import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button } from '@/components';
import './Popup.scss';

class Popup extends React.PureComponent {
  overflow = null;

  componentDidMount() {
    this.overflow = document.querySelector('body').style.overflow;
    document.querySelector('body').style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.querySelector('body').style.overflow = this.overflow;
  }

  render() {
    const { className, open, children, title, setOpen, full } = this.props;

    return (
      <div
        className={`popup-wrapper g-overlay scrollbar ${className} ${open ? 'd-flex' : 'd-none'} ${full ? 'full' : ''}`}
      >
        <div>
          {title && <div className="popup-title">{title}</div>}
          {setOpen && (
            <Button
              size="sm"
              color="black"
              className="close-popup-button g-circle-icon-button"
              onClick={() => {
                if (setOpen) {
                  setOpen(false);
                }
              }}
            >
              <i className="fal fa-times" />
            </Button>
          )}
          <div className="popup-content">{children}</div>
        </div>
      </div>
    );
  }
}

Popup.defaultProps = {
  className: '',
  title: '',
  full: false,
};

Popup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  full: PropTypes.bool,
};

export default withTranslation()(Popup);
