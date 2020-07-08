import React from 'react';
import PropTypes from 'prop-types';
import { Swipeable } from 'react-swipeable';
import numeral from 'numeral';
import { withTranslation } from 'react-i18next';
import { Button, Card, CardBody } from '@/components';
import './ProgressController.scss';
import { TopicPropTypes, UserPropTypes } from '@/proptypes';

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
    const { topic, users, isAdmin, chapterPageList, currentChapterId, currentPageId, projectorScrollInfo } = this.props;

    const { movePage, sendMoveScroll } = this.props;

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
        <div className="flex-grow-1 position-relative">
          <div className="g-attach-parent process-layout bg-gray-300 py-2 d-flex flex-column">
            <Card className="border-0 flex-grow-0">
              <CardBody>
                <div className="process-percentage">
                  <div className="process-bg">
                    <div className="label">{t('진행율')}</div>
                    <div className="percentage">{numeral(currentSeq / totalPageCount).format('0.00%')}</div>
                    <div className="percentage-data">
                      ({currentSeq}/{totalPageCount})
                    </div>
                    <div
                      className="bar"
                      style={{
                        height: `${(currentSeq / totalPageCount) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="process-bg">
                    <div className="label">{t('온라인')}</div>
                    <div className="percentage">{numeral(onlineUserCount / totalUserCount).format('0.00%')}</div>
                    <div className="percentage-data">
                      ({onlineUserCount}/{totalUserCount})
                    </div>
                    <div
                      className="bar"
                      style={{
                        height: `${(onlineUserCount / totalUserCount) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="process-bg">
                    <div className="label">{t('집중도')}</div>
                    <div className="percentage">{numeral(focusUserCount / totalUserCount).format('0.00%')}</div>
                    <div className="percentage-data">
                      ({focusUserCount}/{totalUserCount})
                    </div>
                    <div
                      className="bar"
                      style={{
                        height: `${(focusUserCount / totalUserCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="border-0 flex-grow-0 mt-2">
              <CardBody>
                <div className="line py-0">
                  <div className="label chapter-page-label">
                    <span>{t('현재 위치')}</span>
                  </div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="value chapter-page-title">
                    <div>
                      <div>{currentChapter.title}</div>
                      <div>
                        <i className="fal fa-chevron-right mx-2" />
                        {currentPage.title}
                      </div>
                      <div className="popup-button">
                        <span>
                          <i className="fal fa-window" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="line py-0">
                  <div className="label chapter-page-label">
                    <span>{t('챕터')}</span>
                  </div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="value text-right">
                    <div className="chapter-list">
                      {chapterPageList.map((chapter) => {
                        return (
                          <div key={chapter.id} className={`${currentChapterId === chapter.id ? 'selected' : ''}`} />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="line py-0">
                  <div className="label chapter-page-label">
                    <span>{t('페이지')}</span>
                  </div>
                  <div className="separator">
                    <div />
                  </div>
                  <div className="value text-right">
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
            <Card className="border-0 flex-grow-1 mt-2">
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
                    <i className={`${swipingDir === 'Left' ? 'swiping' : ''} fal fa-chevron-left`} />
                  </Button>
                  <div className="scroll-controller">
                    <Button
                      className="flex-grow-0 g-no-focus"
                      color="transparent"
                      onClick={() => {
                        sendMoveScroll('up');
                      }}
                    >
                      <i className={`${swipingDir === 'Up' ? 'swiping' : ''} fal fa-chevron-up`} />
                    </Button>
                    <div>
                      <div>
                        <div className="rounded">
                          {projectorScrollInfo.windowHeight && projectorScrollInfo.contentViewerHeight && (
                            <div
                              className="window"
                              style={{
                                height: `${(projectorScrollInfo.windowHeight /
                                  projectorScrollInfo.contentViewerHeight) *
                                  100}%`,
                                top: `${(projectorScrollInfo.scrollTop / projectorScrollInfo.contentViewerHeight) *
                                  100}%`,
                              }}
                            >
                              <div>
                                <span className="g-tag bg-primary text-white">스크린</span>
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
                    <Button
                      className="flex-grow-0 g-no-focus"
                      color="transparent"
                      onClick={() => {
                        sendMoveScroll('down');
                      }}
                    >
                      <i className={`${swipingDir === 'Down' ? 'swiping' : ''} fal fa-chevron-down`} />
                    </Button>
                  </div>
                  <Button
                    color="transparent g-no-focus"
                    onClick={() => {
                      movePage(true);
                    }}
                  >
                    <i className={`${swipingDir === 'Right' ? 'swiping' : ''} fal fa-chevron-right`} />
                  </Button>
                </Swipeable>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="bottom-fixed-menu flex-grow-0 d-flex flex-row bg-black">
          {isAdmin && (
            <>
              <Button
                className="g-no-focus flex-fill text-white p-3"
                color="transparent"
                onClick={() => {
                  movePage(false);
                }}
              >
                <i className="fal fa-chevron-left" />
                <div>
                  <span>이전 페이지</span>
                </div>
              </Button>
              <Button
                className="g-no-focus flex-fill text-white p-3"
                color="transparent"
                onClick={() => {
                  movePage(true);
                }}
              >
                <i className="fal fa-chevron-right" />
                <div>
                  <span>다음 페이지</span>
                </div>
              </Button>
            </>
          )}
        </div>
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
  users: PropTypes.arrayOf(UserPropTypes),
  isAdmin: PropTypes.bool,
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
};

export default withTranslation()(ProgressController);
