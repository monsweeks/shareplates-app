import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { BottomButton, Card, CardBody, DateDuration, DateTime, SubLabel, Table, UserIcon } from '@/components';
import request from '@/utils/request';
import './ShareStat.scss';
import { convertUsers } from '@/pages/Users/util';

const cols = ['sessionCnt', 'userCnt', 'focusCnt'];

class ShareStat extends React.Component {
  timeAxis = React.createRef();

  countAxis = React.createRef();

  graph = React.createRef();

  onResizeDebounced = null;

  constructor(props) {
    super(props);
    this.state = {
      topic: {},
      share: {
        id: null,
        name: '',
        memo: '',
        privateYn: false,
        currentChapterId: null,
        currentPageId: null,
      },
      totalShareMinutes: 0,
      progress: 0,
      accessCode: {},
      shareTimeBucketId: null,

      shareFlowList: [],
      pageChangedList: [],
      scaleX: null,
      scaleY: null,
      domainEndDate: null,

      shareOpenDate: null,
      shareCloseDate: null,

      chapterNames: {},
      pageNames: {},
      max: 0,
    };

    this.onResizeDebounced = debounce(this.onResize, 400);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResizeDebounced);
    const { shareId } = this.props;
    this.getShareInfo(shareId);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeDebounced);
    this.onResizeDebounced.cancel();
  }

  onResize = () => {
    this.draw();
  };

  getShareInfo = (shareId) => {
    request.get(
      `/api/shares/${shareId}/detail`,
      null,
      (data) => {
        const next = { ...data };
        next.share.shareUsers = convertUsers(data.share.shareUsers);
        const { shareTimeBuckets, currentChapterId, currentPageId } = next.share;
        const shareTimeBucketId = shareTimeBuckets && shareTimeBuckets.length > 0 ? shareTimeBuckets[0].id : null;

        // 총 공유 시간 계산
        let totalShareMinutes = 0;
        if (shareTimeBuckets) {
          for (let i = 0; i < shareTimeBuckets.length; i += 1) {
            const now = new Date();
            const closeDate = shareTimeBuckets[i].closeDate || new Date(now.getTime());
            totalShareMinutes +=
              Math.round(
                ((new Date(closeDate).getTime() - new Date(shareTimeBuckets[i].openDate).getTime()) * 10) / (60 * 1000),
              ) / 10;
          }
        }

        // 진행율 계산
        const currentSeq = this.getCurrentPageSequence(data.chapterPageList, currentChapterId, currentPageId);
        const progress = Math.round((currentSeq / data.topic.pageCount) * 1000) / 10;

        // 챕터 및 페이지 이름 추출
        const chapterNames = {};
        const pageNames = {};
        data.chapterPageList.forEach((chapter) => {
          chapterNames[chapter.id] = chapter.title;
          chapter.pages.forEach((page) => {
            pageNames[page.id] = page.title;
          });
        });

        this.setState(
          {
            accessCode: next.accessCode,
            share: next.share,
            shareTimeBucketId,
            topic: data.topic,
            totalShareMinutes,
            progress,
            chapterNames,
            pageNames,
          },
          () => {
            if (shareTimeBucketId) {
              this.getShareTimeBucketData(shareTimeBucketId);
            }
          },
        );
      },
      null,
      true,
    );
  };

  getShareFlowList = (targetList) => {
    const sum = {};
    const list = [];
    cols.forEach((col) => {
      sum[col] = 0;
    });

    for (let i = 0; i < targetList.length; i += 1) {
      const item = {
        time: new Date(targetList[i].time),
      };

      let total = 0;
      cols.forEach((col) => {
        // TODO 테스트를 위해 마이너스 값 보정
        sum[col] += Math.abs(Number(targetList[i][col]));
        item[col] = sum[col];
        total += item[col];
      });

      // TODO 테스트를 위해 포커스 값을 사용자 값 보다 작게 설정
      if (item.userCnt < item.focusCnt) {
        item.focusCnt = item.userCnt * (Math.random() * 1);
      }

      item.focusPercentage = item.userCnt > 0 ? Math.round((item.focusCnt / item.userCnt) * 100) : null;
      item.total = total;
      list.push(item);
    }

    const minFocusPercentage = d3.min(list, (d) => {
      return d.focusPercentage ? d.focusPercentage : Infinity;
    });

    const min = list.find((d) => d.focusPercentage === minFocusPercentage);
    if (min) {
      min.min = true;
    }

    const maxFocusPercentage = d3.max(list, (d) => {
      return d.focusPercentage;
    });

    const max = list.find((d) => d.focusPercentage === maxFocusPercentage);
    if (max) {
      max.max = true;
    }

    return list;
  };

  getPageChangedList = (target) => {
    return target.map((item) => {
      return {
        ...item,
        time: new Date(item.time),
      };
    });
  };

  getChangeChangedList = (target) => {
    return target
      .filter((info, i) => {
        if (i < 1) {
          return true;
        }
        return target[i - 1].chapterId !== info.chapterId;
      })
      .map((info) => {
        return {
          time: new Date(info.time),
          chapterId: info.chapterId,
        };
      });
  };

  getShareTimeBucketData = (shareTimeBucketId) => {
    const { share } = this.state;
    const { openDate, closeDate } = share.shareTimeBuckets.find((d) => d.id === shareTimeBucketId);

    const hasTimeBucket = share.shareTimeBuckets && share.shareTimeBuckets.length > 0;
    const shareOpenDate = hasTimeBucket ? share.shareTimeBuckets[0].openDate : null;
    const shareCloseDate = hasTimeBucket ? share.shareTimeBuckets[share.shareTimeBuckets.length - 1].closeDate : null;

    request.get(
      `/api/stats/shares/${share.id}`,
      {
        startDate: openDate,
        endDate: closeDate,
      },
      (data) => {
        this.setState(
          {
            shareTimeBucketId,
            shareFlowList: this.getShareFlowList(data.ShareAccessInfo),
            pageChangedList: this.getPageChangedList(data.PageChangedInfo),
            chapterChangedList: this.getChangeChangedList(data.PageChangedInfo),
            shareOpenDate,
            shareCloseDate,
          },
          () => {
            this.draw();
          },
        );
      },
    );
  };

  draw = () => {
    const { share, shareTimeBucketId, shareFlowList } = this.state;
    const { openDate, closeDate } = share.shareTimeBuckets.find((d) => d.id === shareTimeBucketId);
    let timeInterval = 60 * 1000;
    if (shareFlowList.length > 1) {
      timeInterval = shareFlowList[1].time - shareFlowList[0].time;
    }
    this.drawTimeAxis(openDate, closeDate, timeInterval);
    this.drawCountAxis(shareFlowList);
  };

  drawCountAxis = (list) => {
    if (this.countAxis && this.countAxis.current) {
      const { clientWidth: width, clientHeight: height } = this.countAxis.current;
      let svg = d3.select(this.countAxis.current).select('svg');
      let group = null;
      if (svg.size() > 0) {
        svg.attr('width', width).attr('height', height);
        group = svg.select('g.count-axis-group');
      } else {
        svg = d3
          .select(this.countAxis.current)
          .append('svg')
          .attr('width', width)
          .attr('height', height);
        group = svg.append('g').attr('class', 'count-axis-group');
      }

      // 최대 사용자 숫자
      const max = d3.max(list, (d) => {
        return d.userCnt;
      });

      const scaleY = d3
        .scaleLinear()
        .domain([0, max * 1.2])
        .range([height, 0]);

      const tickSize = 10;

      const yTicks = Math.floor(height / 30);
      const axisY = d3.axisLeft(scaleY);
      axisY.tickFormat((d) => {
        if (d === 0) {
          return '';
        }
        return d;
      });
      axisY.tickSize(-tickSize);
      axisY.ticks(yTicks < 2 ? 2 : yTicks);
      group.call(axisY);
      group.attr('transform', `translate(${width - tickSize - 1}, 0)`);

      this.setState({
        scaleY,
        max,
      });
    }
  };

  drawTimeAxis = (startDate, endDate, timeInterval) => {
    if (this.timeAxis && this.timeAxis.current) {
      const { clientWidth: width, clientHeight: height } = this.timeAxis.current;
      let svg = d3.select(this.timeAxis.current).select('svg');
      let group = null;
      if (svg.size() > 0) {
        svg.attr('width', width).attr('height', height);
        group = svg.select('g.time-axis-group');
      } else {
        svg = d3
          .select(this.timeAxis.current)
          .append('svg')
          .attr('width', width)
          .attr('height', height);
        group = svg.append('g').attr('class', 'time-axis-group');
      }

      const domainStartDate = new Date(Math.floor(new Date(startDate).getTime() / (60 * 1000)) * (60 * 1000));
      const domainEndDate = new Date(
        Math.floor(new Date(endDate).getTime() / (60 * 1000)) * (60 * 1000) + timeInterval,
      );

      const scaleX = d3
        .scaleTime()
        .range([0, width])
        .domain([domainStartDate, domainEndDate]);

      const axisX = d3.axisBottom(scaleX);
      axisX.tickFormat((d) => {
        return moment(d).format('HH:mm');
      });

      const tickSize = 10;

      // const xTicks = Math.floor(width / 100);
      // axisX.tickSize(-10).ticks(xTicks < 2 ? 2 : xTicks);
      axisX.tickSize(-tickSize);

      group.call(axisX);
      group.attr('transform', `translate(0, ${tickSize + 1})`);

      this.setState({
        scaleX,
        domainEndDate,
      });
    }
  };

  getCurrentPageSequence = (chapterPageList, chapterId, pageId) => {
    let seq = 0;
    if (chapterPageList) {
      for (let i = 0; i < chapterPageList.length; i += 1) {
        const chapter = chapterPageList[i];
        if (chapter.id === chapterId) {
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
    const {
      share,
      accessCode,
      shareTimeBucketId,

      topic,
      pageChangedList,
      chapterChangedList,
      totalShareMinutes,
      progress,

      scaleX,
      scaleY,
      domainEndDate,

      shareOpenDate,
      shareCloseDate,

      chapterNames,
      pageNames,
      shareFlowList,
      max,
    } = this.state;
    const { t } = this.props;

    const graphWidth = this.graph.current ? this.graph.current.clientWidth : null;
    const graphHeight = this.graph.current ? this.graph.current.clientHeight : null;
    const itemWidth = graphWidth / shareFlowList.length;

    return (
      <div className="share-state-wrapper">
        {share && (
          <div className="share-state-content">
            <div className="summary-info">
              <div className="general-info">
                <SubLabel>{t('공유 정보')}</SubLabel>
                <Card>
                  <CardBody>
                    <div className="share-name">{share.name}</div>
                    <div className="share-duration">
                      <DateTime className="g-tag" value={shareOpenDate} />
                      <span className="g-tag">~</span>
                      <DateTime className="g-tag" value={shareCloseDate} />
                    </div>
                    <div className="topic-name">
                      <span className="g-tag border">{t('토픽')}</span>
                      <span className="g-tag">{topic.name}</span>
                    </div>
                    <div className="share-memo">{share.memo}</div>
                    <div className="count-info">
                      <div>
                        <div className="icon">
                          <i className="fal fa-smile" />
                        </div>
                        <div className="counter">{share.shareUsers && share.shareUsers.length}</div>
                        <div className="tag">
                          <span>USERS</span>
                        </div>
                      </div>
                      <div className="separator">
                        <div />
                      </div>
                      <div>
                        <div className="icon">
                          <i className="fal fa-clock" />
                        </div>
                        <div className="counter">{totalShareMinutes}</div>
                        <div className="tag">
                          <span>MINUTES</span>
                        </div>
                      </div>
                      <div className="separator">
                        <div />
                      </div>
                      <div>
                        <div className="icon">
                          <i className="fal fa-percentage" />
                        </div>
                        <div className="counter">{progress}</div>
                        <div className="tag">
                          <span>CONTENTS</span>
                        </div>
                      </div>
                    </div>
                    <div className="access-code">
                      <span className="g-tag ">ACCESS CODE</span>
                      <span className="g-tag ">{accessCode && accessCode.code}</span>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="share-user-info">
                <SubLabel>{t('참여자')}</SubLabel>
                <Card className='flex-grow-1'>
                  <CardBody className='position-relative'>
                    <div className="g-attach-parent scrollbar">
                      <div className="share-user-list">
                        {share.shareUsers &&
                        share.shareUsers.map((user) => {
                          return (
                            <div>
                              <div className="user-icon">
                                <UserIcon info={user.info} />
                              </div>
                              <div className="user-text">
                                <div className="name">{user.name}</div>
                                <div className="email">{user.email}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div className="stat-summary">
                <SubLabel>{t('요약 정보')}</SubLabel>
                <Card>
                  <CardBody>
                    <div className="stat-summary-content">
                      <div className="count-info">
                        <div>
                          <div>
                            <div className="metric">{t('평균 집중도')}</div>
                            <div className="counter">25%</div>
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div>
                            <div className="metric">{t('최대 집중도')}</div>
                            <div className="counter">75%</div>
                          </div>
                        </div>
                        <div>
                          <div>
                            <div className="metric">{t('최소 집중 페이지')}</div>
                            <div className="text">페이지1</div>
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div>
                            <div className="metric">{t('최대 집중 페이지')}</div>
                            <div className="text">페이지3</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
            <div className="share-state mt-3">
              <SubLabel className="share-log-title">{t('공유 로그')}</SubLabel>
              <div className="share-log-content">
                <div className="g-attach-parent">
                  <Card className="share-log-card h-100">
                    <div className="list">
                      {share.shareTimeBuckets && share.shareTimeBuckets.length > 0 && (
                        <Table hover size="sm">
                          <tbody>
                            {share.shareTimeBuckets.map((bucket) => {
                              return (
                                <tr
                                  key={bucket.id}
                                  className={`${shareTimeBucketId === bucket.id ? 'selected' : ''}`}
                                  onClick={() => {
                                    this.getShareTimeBucketData(bucket.id);
                                  }}
                                >
                                  <td className="open-date">
                                    <DateTime value={bucket.openDate} />
                                  </td>
                                  <td className="duration">
                                    {bucket.closeDate && (
                                      <DateDuration
                                        className="bg-primary text-white g-tag"
                                        icon={<i className="fal fa-clock" />}
                                        startValue={bucket.openDate}
                                        endValue={bucket.closeDate}
                                      />
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      )}
                    </div>
                    <div className="viewer">
                      <div className="page-change-graph">
                        <div className="chapter-list">
                          {scaleX &&
                            chapterChangedList.map((chapterInfo, i) => {
                              let endTime;
                              if (chapterChangedList[i + 1]) {
                                endTime = chapterChangedList[i + 1].time;
                              } else {
                                endTime = domainEndDate;
                              }

                              const left = scaleX(new Date(chapterInfo.time));
                              const width = scaleX(new Date(endTime)) - scaleX(new Date(chapterInfo.time));

                              return (
                                <div
                                  key={i}
                                  className="change-item chapter-info"
                                  style={{
                                    left,
                                    width,
                                  }}
                                >
                                  <div className="start-bar" />
                                  <div className="line" />
                                  {width > 50 && <div className="arrow" />}
                                  <div className="text-data">
                                    <span>{chapterNames[Number(chapterInfo.chapterId)]}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className="page-list">
                          {scaleX &&
                            pageChangedList.map((pageInfo, i) => {
                              let endTime;
                              if (pageChangedList[i + 1]) {
                                endTime = pageChangedList[i + 1].time;
                              } else {
                                endTime = domainEndDate;
                              }

                              const left = scaleX(new Date(pageInfo.time));
                              const width = scaleX(new Date(endTime)) - scaleX(new Date(pageInfo.time));

                              return (
                                <div
                                  key={i}
                                  className="change-item page-info"
                                  style={{
                                    left,
                                    width,
                                  }}
                                >
                                  <div className="start-bar" />
                                  <div className="line" />
                                  {width > 50 && <div className="arrow" />}
                                  <div className="text-data">
                                    <span>{pageNames[Number(pageInfo.pageId)]}</span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                      <div className="share-stat-graph">
                        <div className="counter-axis">
                          <div ref={this.countAxis} />
                        </div>
                        <div ref={this.graph} className="graph">
                          <div className="g-attach-parent">
                            {scaleX &&
                              scaleY &&
                              graphWidth &&
                              graphHeight &&
                              shareFlowList.map((item) => {
                                return (
                                  <div
                                    key={item.time}
                                    className={`graph-item ${item.min ? 'min' : ''} ${item.max ? 'max' : ''}`}
                                    style={{
                                      width: `${itemWidth - 3}px`,
                                      left: `${scaleX(item.time)}px`,
                                    }}
                                  >
                                    {(item.min || item.max) && <div className="marker" />}
                                    {item.userCnt > 0 && (
                                      <div
                                        className="focus-percentage"
                                        style={{
                                          bottom: `${graphHeight - scaleY(item.userCnt) + 3}px`,
                                        }}
                                      >
                                        <span>
                                          {item.userCnt ? `${Math.round((item.focusCnt / item.userCnt) * 100)}%` : ''}
                                        </span>
                                      </div>
                                    )}
                                    <div
                                      className="user-cnt"
                                      style={{
                                        height: `${graphHeight - scaleY(item.userCnt)}px`,
                                      }}
                                    />
                                    <div
                                      className="focus-cnt"
                                      style={{
                                        height: `${graphHeight - scaleY(item.focusCnt)}px`,
                                      }}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                          {scaleY && (
                            <div
                              className="max-line"
                              style={{
                                bottom: `${graphHeight - scaleY(max) - 1}px`,
                              }}
                            >
                              <div>
                                <span>{max}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="time-axis">
                        <div ref={this.timeAxis} />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}
        <BottomButton
          className="text-right mt-3"
          onList={() => {
            const { history } = this.props;
            const { topicId } = this.state;
            history.push(`/topics/${topicId}/shares`);
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

ShareStat.propTypes = {
  t: PropTypes.func,
  shareId: PropTypes.number,
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareStat)));
