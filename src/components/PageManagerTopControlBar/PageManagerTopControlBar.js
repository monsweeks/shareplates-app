import React from 'react';
import PropTypes from 'prop-types';
import './PageManagerTopControlBar.scss';

class PageManagerTopControlBar extends React.PureComponent {
  render() {
    const { buttons, className } = this.props;

    return (
      <div className={`page-manager-top-control-bar-wrapper g-no-select ${className}`}>
        <div>
          {buttons &&
            buttons.map((button) => {
              return button;
            })}
          {buttons && buttons.length > 0 && <div className="separator" />}
        </div>
      </div>
    );
  }
}

PageManagerTopControlBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
};

export default PageManagerTopControlBar;
