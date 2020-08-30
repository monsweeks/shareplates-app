import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './ShareSideMenu.scss';

class ShareSideMenu extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    // eslint-disable-next-line no-unused-vars,no-shadow
    const { t, isAdmin, share } = this.props;
    const { stopShare } = this.props;
    const { hideShareNavigator, setHideShareNavigator } = this.props;
    const { fullScreen, setFullScreen } = this.props;
    const { isOpenUserPopup, setOpenUserPopup } = this.props;
    const { isOpenCam, setOpenCamPopup} = this.props;

    return (
      <div className="share-side-menu-wrapper">
        <span className={`on-off-button ${share.startedYn ? 'on' : 'off'}`} onClick={stopShare}>
          <span className="on-off" />
          {share.startedYn && <i className="far fa-broadcast-tower" />}
          {!share.startedYn && <i className="fal fa-broadcast-tower" />}
        </span>
        <span
          className={`on-off-button ${hideShareNavigator ? 'on' : 'off'}`}
          onClick={() => {
            setHideShareNavigator(!hideShareNavigator);
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
          className={`on-off-button ${isOpenUserPopup ? 'on' : 'off'}`}
          onClick={() => {
            setOpenUserPopup(!isOpenUserPopup);
          }}
        >
          <span className="on-off" />
          <i className="fal fa-id-badge" />
        </span>
        <span
          className={`on-off-button d-none ${isOpenCam ? 'on' : 'off'}`}
          onClick={() => {
            setOpenCamPopup(!isOpenCam);
          }}
        >
        <span className="on-off" />
          <i className="fal fa-camera-home" />
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

ShareSideMenu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  isAdmin: PropTypes.bool,
  stopShare: PropTypes.func,
  share: PropTypes.shape({
    startedYn: PropTypes.bool,
  }),
  hideShareNavigator: PropTypes.bool,
  setHideShareNavigator: PropTypes.func,
  fullScreen: PropTypes.bool,
  setFullScreen: PropTypes.func,
  isOpenUserPopup: PropTypes.bool,
  setOpenUserPopup: PropTypes.func,
  isOpenCam: PropTypes.bool,
  setOpenCamPopup: PropTypes.func,
};

export default withRouter(withTranslation()(ShareSideMenu));
