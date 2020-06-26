import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { TopLogo } from '@/components';
import { ShareNavigator, ShareSideMenu } from '@/assets';
import { SharePropTypes } from '@/proptypes';
import './ShareHeader.scss';

class ShareHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideShareNavigator: false,
      fullScreen: false,
    };
  }

  setHideShareNavigator = (value) => {
    this.setState({
      hideShareNavigator: value,
    });
  };

  setFullScreen = (value) => {
    const elem = document.documentElement;
    if (value) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
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

    this.setState({
      fullScreen: value,
    });
  };

  render() {
    const { share, chapters, pages, currentChapterId, currentPageId, isAdmin, isOpenUserPopup } = this.props;
    const { stopShare, setChapter, setPage, setOpenUserPopup } = this.props;

    const { hideShareNavigator, fullScreen } = this.state;

    return (
      <div className={`share-header-wrapper  g-no-select ${hideShareNavigator ? 'hide' : ''}`}>
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
              hideShareNavigator={hideShareNavigator}
              setHideShareNavigator={this.setHideShareNavigator}
              fullScreen={fullScreen}
              setFullScreen={this.setFullScreen}
              isOpenUserPopup={isOpenUserPopup}
              setOpenUserPopup={setOpenUserPopup}
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
  setChapter: PropTypes.func,
  setPage: PropTypes.func,
  stopShare: PropTypes.func,
  setOpenUserPopup: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareHeader)));
