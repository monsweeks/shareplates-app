import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';
import numeral from 'numeral';
import { withTranslation } from 'react-i18next';
import { Button, Card, CardBody } from '@/components';
import './ProgressController.scss';
import { SharePropTypes, TopicPropTypes, UserPropTypes } from '@/proptypes';
import { PROJECTOR_TABS } from '@/constants/constants';

class ProgressController extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      swipingDir: numeral,
    };
  }

  onMoveSwiped = (e) => {
    const { movePage, sendMoveScroll, setOmitEvent } = this.props;

    setOmitEvent(true);
    if (e.dir === 'Right') {
      movePage(true);
    }

    if (e.dir === 'Left') {
      movePage(false);
    }

    if (e.dir === 'Up') {
      sendMoveScroll('up');
    }

    if (e.dir === 'Down') {
      sendMoveScroll('down');
    }

    this.setState({
      swipingDir: null,
    });
  };

  onMoveSwiping = (e) => {
    const { swipingDir } = this.state;
    if (swipingDir !== e.dir) {
      this.setState({
        swipingDir: e.dir,
      });
    }
  };

  getCurrentPageSequence = (chapterPageList, chaterId, pageId) => {
    let seq = 0;
    if (chapterPageList) {
      for (let i = 0; i < chapterPageList.length; i += 1) {
        const chapter = chapterPageList[i];
        if (chapter.id === chaterId) {
          if (chapter.pages) {
            seq += 1 + chapter.pages.findIndex((page) => page.id === pageId);
          }
          break;
        }
        seq += chapter.pages.length;
      }
    }

    return seq;
  };

  render() {
    const { className, t } = this.props;
    const {
      topic,
      share,
      users,
      chapterPageList,
      currentChapterId,
      currentPageId,
      projectorScrollInfo,
    } = this.props;

    const { movePage, sendMoveScroll, setOption, startShare, closeShare, options } = this.props;

    const { swipingDir } = this.state;

    const totalPageCount = topic.pageCount;
    const currentSeq = this.getCurrentPageSequence(chapterPageList, currentChapterId, currentPageId);

    const currentChapter = chapterPageList.find((chapter) => chapter.id === currentChapterId);
    const currentPage = currentChapter.pages.find((page) => page.id === currentPageId);

    const noBannedUsers = users.filter((u) => !u.banYn);
    const onlineUserCount = noBannedUsers.filter((u) => u.status === 'ONLINE').length;
    const totalUserCount = noBannedUsers.length;
    const focusUserCount = noBannedUsers.filter((u) => u.focusYn).length;

    return (
      <div className={`progress-controller-wrapper ${className}`}>
        {!share.startedYn && (
          <div className="flex-grow-1 position-relative d-flex flex-column stand-by-content">
            <Card className="border-0 flex-grow-0 m-4">
              <CardBody className="p-0">
                <div className="message mb-3">
                  <i className="fal fa-exclamation-circle" /> 대기 화면 탭 변경
                </div>
                <div className="tab-buttons">
                  {PROJECTOR_TABS.map((info) => {
                    return (
                      <div
                        key={info.key}
                        className={`${options.projectorStandByTab === info.key ? 'selected' : ''}`}
                        onClick={() => {
                          setOption('projectorStandByTab', info.key);
                        }}
                      >
                        {info.value}
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
            <Card className="border-0 flex-grow-1 mx-3 mb-3">
              <CardBody className="p-2 d-flex flex-column">
                <div className="message flex-grow-0">
                  <i className="fal fa-exclamation-circle" /> 공유 상태 관리
                </div>
                <div className="flex-grow-1 d-flex">
                  <div className="align-self-center text-center w-100">
                    <Button className="start-button" color="yellow" outline onClick={startShare}>
                      공유 시작
                    </Button>
                  </div>
                </div>
                <div className="flex-grow-0">
                  <Button color="danger" size="sm" onClick={closeShare}>
                    공유 종료
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
        {share.startedYn && (
          <>
            <div className="flex-grow-1 position-relative">
              <div className="g-attach-parent process-layout d-flex flex-column">
                <Card className="border-0 flex-grow-0 mt-4 mx-4 mb-0">
                  <CardBody className="p-0">
                    <div className="message mb-2">
                      <i className="fal fa-exclamation-circle" /> 공유 진행 상태
                    </div>
                    <div className="focus-percentage">
                      <div className="process-bg">
                        <div className="left">
                          <div className="label">
                            <i className="fas fa-map-marker-alt" />
                          </div>
                          <div className="percentage">{numeral(currentSeq / totalPageCount).format('0.00%')}</div>
                          <div className="percentage-data">
                            ({currentSeq}/{totalPageCount})
                          </div>
                        </div>
                        <div className="right">
                          <div
                            className="bar"
                            style={{
                              height: `${(currentSeq / totalPageCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="process-bg">
                        <div className="left">
                          <div className="label">
                            <i className="fal fa-wifi" />
                          </div>
                          <div className="percentage">{numeral(onlineUserCount / totalUserCount).format('0.00%')}</div>
                          <div className="percentage-data">
                            ({onlineUserCount}/{totalUserCount})
                          </div>
                        </div>
                        <div className="right">
                          <div
                            className="bar"
                            style={{
                              height: `${(onlineUserCount / totalUserCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="process-bg">
                        <div className="left">
                          <div className="label">
                            <i className="fas fa-eye" />
                          </div>
                          <div className="percentage">{numeral(focusUserCount / totalUserCount).format('0.00%')}</div>
                          <div className="percentage-data">
                            ({focusUserCount}/{totalUserCount})
                          </div>
                        </div>
                        <div className="right">
                          <div
                            className="bar"
                            style={{
                              height: `${(focusUserCount / totalUserCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card className="border-0 flex-grow-0 mx-4 mb-0">
                  <CardBody className="p-0">
                    <div className="current-info-content">
                      <div className="current-info mb-2">
                        <div>
                          <span className="char">C</span>
                          <span>{currentChapter && currentChapter.title}</span>
                        </div>
                        <div>
                          <span className="char p">P</span>
                          <span>{currentPage && currentPage.title}</span>
                        </div>
                      </div>
                      <div className="current-map mb-2">
                        <div className="chapter-list">
                          {chapterPageList.map((chapter) => {
                            return (
                              <div
                                key={chapter.id}
                                className={`${currentChapterId === chapter.id ? 'selected' : ''}`}
                              />
                            );
                          })}
                        </div>
                        <div className="page-list">
                          {currentChapter &&
                            currentChapter.pages.map((page) => {
                              return <div key={page.id} className={`${currentPageId === page.id ? 'selected' : ''}`} />;
                            })}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card className="border-0 flex-grow-1 mb-3">
                  <CardBody className="h-100 d-flex flex-column p-0">
                    <Swipeable
                      className="move-swipeable"
                      onSwiped={this.onMoveSwiped}
                      onSwiping={this.onMoveSwiping}
                      delta={50}
                    >
                      <Button
                        color="transparent g-no-focus"
                        onClick={() => {
                          movePage(false);
                        }}
                      >
                        <i className={`${swipingDir === 'Left' ? 'swiping' : ''} fal fa-arrow-left`} />
                      </Button>
                      <div className="scroll-controller">
                        <Button
                          className="flex-grow-0 g-no-focus"
                          color="transparent"
                          onClick={() => {
                            sendMoveScroll('up');
                          }}
                        >
                          <i className={`${swipingDir === 'Up' ? 'swiping' : ''} fal fa-arrow-from-bottom`} />
                        </Button>
                        <div>
                          <div>
                            <div className="rounded">
                              <div>
                                {projectorScrollInfo.windowHeight && projectorScrollInfo.contentViewerHeight && (
                                  <div
                                    className="window"
                                    style={{
                                      height: `${(projectorScrollInfo.windowHeight /
                                        projectorScrollInfo.contentViewerHeight) *
                                        100}%`,
                                      top: `${(projectorScrollInfo.scrollTop /
                                        projectorScrollInfo.contentViewerHeight) *
                                        100}%`,
                                    }}
                                  >
                                    <div>
                                      <span className="g-tag">스크린</span>
                                    </div>
                                  </div>
                                )}
                                {!(projectorScrollInfo.windowHeight && projectorScrollInfo.contentViewerHeight) && (
                                  <div className="h-100 w-100 d-flex">
                                    <div className="align-self-center w-100 text-center ">
                                      {t('연결된 프로젝터 타입이 없습니다')}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="flex-grow-0 g-no-focus"
                          color="transparent"
                          onClick={() => {
                            sendMoveScroll('down');
                          }}
                        >
                          <i className={`${swipingDir === 'Down' ? 'swiping' : ''} fal fa-arrow-from-top`} />
                        </Button>
                      </div>
                      <Button
                        color="transparent g-no-focus"
                        onClick={() => {
                          movePage(true);
                        }}
                      >
                        <i className={`${swipingDir === 'Right' ? 'swiping' : ''} fal fa-arrow-right`} />
                      </Button>
                    </Swipeable>
                  </CardBody>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

ProgressController.defaultProps = {
  className: '',
};

ProgressController.propTypes = {
  className: PropTypes.string,
  topic: TopicPropTypes,
  share: SharePropTypes,
  users: PropTypes.arrayOf(UserPropTypes),
  t: PropTypes.func,
  chapterPageList: PropTypes.arrayOf(PropTypes.any),
  currentChapterId: PropTypes.number,
  currentPageId: PropTypes.number,
  movePage: PropTypes.func,
  projectorScrollInfo: PropTypes.shape({
    windowHeight: PropTypes.number,
    contentViewerHeight: PropTypes.number,
    scrollTop: PropTypes.number,
  }),
  sendMoveScroll: PropTypes.func,
  setOmitEvent: PropTypes.func,
  setOption: PropTypes.func,
  startShare: PropTypes.func,
  closeShare: PropTypes.func,

  options: PropTypes.objectOf(PropTypes.any),
};

export default withTranslation()(ProgressController);
