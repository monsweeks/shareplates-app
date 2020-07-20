import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { debounce } from 'lodash';
import { TopLogo } from '@/components';
import { ShareNavigator, ShareSideMenu } from '@/assets';
import { SharePropTypes } from '@/proptypes';
import './ShareHeader.scss';

class ShareHeader extends React.Component {
  constructor(props) {
    super(props);
    this.fullScreenDebounced = debounce(this.setFullScreen, 300);
  }

  componentWillUnmount() {
    this.fullScreenDebounced.cancel();
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;
    if (options.fullScreen && prevProps.options.fullScreen !== options.fullScreen) {
      this.fullScreenDebounced(true);
    }

    if (!options.fullScreen && prevProps.options.fullScreen !== options.fullScreen) {
      this.fullScreenDebounced(false);
    }
  }

  setFullScreen = (value) => {
    const elem = document.documentElement;
    try {
      if (value) {
        if (elem.requestFullscreen) {
          const promise = elem.requestFullscreen();
          promise.catch(() => {});
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      }

      if (!value) {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {
      share,
      chapters,
      pages,
      currentChapterId,
      currentPageId,
      isAdmin,
      isOpenUserPopup,
      isOpenCam,
      options,
      setOption,
    } = this.props;
    const { stopShare, setChapter, setPage, setOpenUserPopup, setOpenCamPopup } = this.props;

    return (
      <div className={`share-header-wrapper  g-no-select ${options.hideShareNavigator ? 'hide' : ''}`}>
        <div>
          <div className="logo-area">
            <TopLogo />
          </div>
          <div className="menu">
            {chapters.length > 0 && (
              <>
                <ShareNavigator
                  className="chapters-menu"
                  list={chapters}
                  selectedId={currentChapterId}
                  onClick={setChapter}
                  onPrevClick={setChapter}
                  onNextClick={setChapter}
                />
                <ShareNavigator
                  className="pages-menu"
                  list={pages}
                  selectedId={currentPageId}
                  onClick={setPage}
                  onPrevClick={setPage}
                  onNextClick={setPage}
                />
              </>
            )}
            {chapters.length < 1 && (
              <div className="no-menu">
                <div>작성된 컨텐츠가 없습니다</div>
              </div>
            )}
          </div>
          <div className="side-menu">
            <ShareSideMenu
              share={share}
              isAdmin={isAdmin}
              stopShare={stopShare}
              hideShareNavigator={options.hideShareNavigator}
              setHideShareNavigator={(value) => {
                setOption('hideShareNavigator', value);
              }}
              fullScreen={options.fullScreen}
              setFullScreen={(value) => {
                setOption('fullScreen', value);
              }}
              isOpenUserPopup={isOpenUserPopup}
              isOpenCam={isOpenCam}
              setOpenUserPopup={setOpenUserPopup}
              setOpenCamPopup={setOpenCamPopup}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

ShareHeader.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  isAdmin: PropTypes.bool,
  share: SharePropTypes,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
  ),
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
    }),
  ),
  currentChapterId: PropTypes.number,
  currentPageId: PropTypes.number,
  isOpenUserPopup: PropTypes.bool,
  isOpenCam: PropTypes.bool,
  setChapter: PropTypes.func,
  setPage: PropTypes.func,
  stopShare: PropTypes.func,
  setOpenUserPopup: PropTypes.func,
  setOpenCamPopup: PropTypes.func,
  options: PropTypes.shape({
    hideShareNavigator: PropTypes.bool,
    fullScreen: PropTypes.bool,
  }),
  setOption: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareHeader)));
