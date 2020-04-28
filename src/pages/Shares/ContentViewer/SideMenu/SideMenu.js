import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './SideMenu.scss';

class SideMenu extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { t, isAdmin, share } = this.props;
    const { stopShare } = this.props;
    const { hideContentViewerMenu, setHideContentViewerMenu } = this.props;
    const { fullScreen, setFullScreen } = this.props;
    const { openUserPopup, setOpenUserPopup } = this.props;

    return (
      <div className="side-menu-wrapper">
        <span className={`on-off-button ${share.startedYn ? 'on' : 'off'}`} onClick={stopShare}>
          <span className="on-off" />
          {share.startedYn && <i className="far fa-broadcast-tower" />}
          {!share.startedYn && <i className="fal fa-broadcast-tower" />}
        </span>
        <span
          className={`on-off-button ${hideContentViewerMenu ? 'on' : 'off'}`}
          onClick={() => {
            setHideContentViewerMenu(!hideContentViewerMenu);
          }}
        >
          <span className="on-off" />
          <i className="fal fa-level-up" />
        </span>
        <span
          className={`on-off-button ${fullScreen ? 'on' : 'off'}`}
          onClick={() => {
            setFullScreen(!fullScreen);
          }}
        >
          <span className="on-off" />
          <i className="fal fa-expand" />
        </span>
        <span
          className={`on-off-button ${openUserPopup ? 'on' : 'off'}`}
          onClick={() => {
            setOpenUserPopup(!openUserPopup);
          }}
        >
          <span className="on-off" />
          <i className="fal fa-id-badge" />
        </span>
        {isAdmin && (
          <span>
            <i className="fal fa-poll" />
          </span>
        )}
        <span>
          <i className="fal fa-file-alt" />
        </span>
        <span>
          <i className="fal fa-solar-panel" />
        </span>
        <span className="d-none">
          <i className="fal fa-chart-line" />
        </span>
        <span className="d-none">
          <i className="fal fa-clock" />
        </span>
        <span className="d-none">
          <i className="fal fa-users-class" />
        </span>
        <span className="d-none">
          <i className="fal fa-cog" />
        </span>
      </div>
    );
  }
}

SideMenu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  isAdmin: PropTypes.bool,
  stopShare: PropTypes.func,
  share: PropTypes.shape({
    startedYn: PropTypes.bool,
  }),
  hideContentViewerMenu: PropTypes.bool,
  setHideContentViewerMenu: PropTypes.func,
  fullScreen: PropTypes.bool,
  setFullScreen: PropTypes.func,
  openUserPopup: PropTypes.bool,
  setOpenUserPopup: PropTypes.func,
};

export default withRouter(withTranslation()(SideMenu));
