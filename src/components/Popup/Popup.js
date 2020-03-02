import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './Popup.scss';
import CircleIcon from '@/components/CircleIcon/CircleIcon';

class Popup extends React.PureComponent {
  render() {
    const { className, open, children, title, setOpen } = this.props;

    return (
      <div className={`popup-wrapper g-overlay ${className} ${open ? 'd-flex' : 'd-none'}`}>
        <div>
          <div className="popup-title">{title}</div>
          <CircleIcon
            className="close-popup-button bg-transparent"
            icon={<i className="fal fa-times" />}
            onClick={() => {
              setOpen(false);
            }}
          />
          <div className="popup-content">{children}</div>
        </div>
      </div>
    );
  }
}

Popup.defaultProps = {
  className: '',
  title: '',
};

Popup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};

export default withTranslation()(Popup);
