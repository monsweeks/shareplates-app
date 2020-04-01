import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './PageManagerTopControlBar.scss';

class PageManagerTopControlBar extends React.PureComponent {
  render() {
    const { t } = this.props;
    const { buttons, className } = this.props;

    console.log(t);

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
  t: PropTypes.func,
  buttons: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
};

export default withRouter(withTranslation()(PageManagerTopControlBar));
