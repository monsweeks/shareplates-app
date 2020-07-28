import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  BottomButton,
  Card,
  CardBody,
  DateDuration,
  DateTime,
  EmptyMessage,
  SubLabel,
  Table,
  UserIcon,
} from '@/components';
import request from '@/utils/request';
import './ShareStat.scss';
import { convertUsers } from '@/pages/Users/util';
import { DATETIME_FORMATS_MAP } from '@/constants/constants';
import { UserPropTypes } from '@/proptypes';

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
      avgFocusPercentage: 0,
      maxFocusPercentage: 0,

      maxFocusChapterId: null,
      maxFocusPageId: null,
      maxFocusTime: null,

      minFocusChapterId: null,
      minFocusPageId: null,
      minFocusTime: null,
      minFocusPageName: '',
      maxFocusPageName: '',
    };

    this.onResizeDebounced = debounce(this.onResize, 400);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResizeDebounced);
    const { shareId } = this.props;
    this.getShareInfo(shareId);
    ReactTooltip.rebuild();
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
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
        sum[col] += Number(targetList[i][col]);
        if (sum[col] < 0) {
          sum[col] = 0;
        }
        item[col] = sum[col];
        total += item[col];
      });

      item.focusPercentage = item.userCnt > 0 ? Math.round((item.focusCnt / item.userCnt) * 100) : null;
      item.total = total;
      list.push(item);
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
    const { share, pageNames } = this.state;
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
        const pageChangedList = this.getPageChangedList(data.contentChangeList);
        const chapterChangedList = this.getChangeChangedList(data.contentChangeList);
        const shareFlowList = this.getShareFlowList(data.shareStateList);

        const maxFocusPercentage = d3.max(shareFlowList, (d) => {
          return d.focusPercentage;
        });

        const maxFocusList = shareFlowList
          .filter((d) => d.focusPercentage === maxFocusPercentage)
          .map((d) => {
            return {
              time: d.time,
              focusCnt: d.focusCnt,
            };
          });

        const maxFocusCnt = d3.max(maxFocusList, (d) => d.focusCnt);
        const maxFocusPercentageItem = maxFocusList.find((d) => d.focusCnt === maxFocusCnt);
        const maxFocusTime = maxFocusPercentageItem.time;
        const bisector = d3.bisector(function(d) {
          return d.time;
        }).left;

        const maxFocusChapterIndex = bisector(chapterChangedList, maxFocusTime);
        const maxFocusChapterId =
          chapterChangedList[
            maxFocusChapterIndex >= chapterChangedList.length ? chapterChangedList.length - 1 : maxFocusChapterIndex
          ].chapterId;
        const maxFocusPageIndex = bisector(pageChangedList, maxFocusTime) - 1;
        const maxFocusPageId =
          pageChangedList[maxFocusPageIndex >= pageChangedList.length ? pageChangedList.length - 1 : maxFocusPageIndex]
            .pageId;

        const minFocusPercentage = d3.min(shareFlowList, (d) => {
          return d.focusPercentage;
        });

        const minFocusList = shareFlowList
          .filter((d) => d.focusPercentage === minFocusPercentage)
          .map((d) => {
            return {
              time: d.time,
              focusCnt: d.focusCnt,
            };
          });

        const minFocusCnt = d3.min(minFocusList, (d) => d.focusCnt);
        const minFocusPercentageItem = minFocusList.find((d) => d.focusCnt === minFocusCnt);
        const minFocusTime = minFocusPercentageItem.time;

        const minFocusChaterIndex = bisector(chapterChangedList, minFocusTime);
        const minFocusChapterId =
          chapterChangedList[
            minFocusChaterIndex >= chapterChangedList.length ? chapterChangedList.length - 1 : minFocusChaterIndex
          ].chapterId;
        const minFocusPageIndex = bisector(pageChangedList, minFocusTime);
        const minFocusPageId =
          pageChangedList[minFocusPageIndex >= pageChangedList.length ? pageChangedList.length - 1 : minFocusPageIndex]
            .pageId;

        let totalPercentage = 0;
        shareFlowList.forEach((d) => {
          totalPercentage += d.focusPercentage;
        });

        this.setState(
          {
            shareTimeBucketId,
            shareFlowList,
            pageChangedList,
            chapterChangedList,
            shareOpenDate,
            shareCloseDate,
            avgFocusPercentage: totalPercentage / shareFlowList.length,
            maxFocusPercentage,
            maxFocusChapterId,
            maxFocusPageId,
            maxFocusTime,
            minFocusChapterId,
            minFocusPageId,
            minFocusTime,
            minFocusPageName: pageNames[minFocusPageId],
            maxFocusPageName: pageNames[maxFocusPageId],
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
    const currentBucket = share.shareTimeBuckets.find((d) => d.id === shareTimeBucketId);
    if (currentBucket) {
      const { openDate, closeDate } = currentBucket;
      let timeInterval = 60 * 1000;
      if (shareFlowList.length > 1) {
        timeInterval = shareFlowList[1].time - shareFlowList[0].time;
      }
      this.drawTimeAxis(openDate, closeDate, timeInterval);
      this.drawCountAxis(shareFlowList);
    }
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
        .domain([0, max * 1.2 > 10 ? max * 1.2 : 10])
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

  getTimeTooltipData = (startTime, endTime, lines) => {
    const { user } = this.props;
    const spendSeconds = Math.round((moment(endTime).valueOf() - moment(startTime).valueOf())/1000);
    let str = `<div class="share-stat-tooltip"><div class="tooltip-time"><span class='start-time'>${moment(startTime).format(DATETIME_FORMATS_MAP[user.dateTimeFormat].F)}</span>`;
    if (endTime) {
      str += `~<span class="spend-time">${spendSeconds >= 60 ? Math.round(spendSeconds / 60) : spendSeconds}${spendSeconds > 60 ? '분' : '초'}</span>`;
    }
    str += '</div>';
    for (let i=0; i<lines.length; i+=1) {
      str += `<div class="tooltip-content">${lines[i]}</div>`;
    }
    str += '</div>';
    return str;
  };

  getTooltipData = (lines) => {
    console.log(lines);
    let str = '';
    str += '<div class="share-stat-tooltip">';
    for (let i=0; i<lines.length; i+=1) {
      str += `<div class="tooltip-content">${lines[i]}</div>`;
    }
    str += '</div>';
    return str;
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
      avgFocusPercentage,
      maxFocusPercentage,

      maxFocusChapterId,
      maxFocusPageId,
      maxFocusTime,

      minFocusChapterId,
      minFocusPageId,
      minFocusTime,
      minFocusPageName,
      maxFocusPageName,
    } = this.state;
    const { t} = this.props;

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
                <Card className="flex-grow-1">
                  <CardBody className="position-relative">
                    <div className="g-attach-parent scrollbar">
                      {share.shareUsers && share.shareUsers.length > 0 && (
                        <div className="share-user-list">
                          {share.shareUsers.map((u) => {
                            return (
                              <div key={u.id}>
                                <div className="user-icon">
                                  <UserIcon info={u.info} />
                                </div>
                                <div className="user-text">
                                  <div className="name">{u.name}</div>
                                  <div className="email">{u.email}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {!(share.shareUsers && share.shareUsers.length > 0) && (
                        <EmptyMessage
                          className="h5 h-100"
                          message={
                            <div>
                              <div className="h5">
                                <i className="fal fa-exclamation-circle" />
                              </div>
                              <div className="h6">{t('참여자가 없습니다')}</div>
                            </div>
                          }
                        />
                      )}
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
                            <div className="counter">{avgFocusPercentage}%</div>
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div>
                            <div className="metric">{t('최대 집중도')}</div>
                            <div className="counter">{maxFocusPercentage}%</div>
                          </div>
                        </div>
                        <div>
                          <div>
                            <div className="metric">{t('최소 집중 페이지')}</div>
                            <div className="text">{minFocusPageName}</div>
                          </div>
                          <div className="separator">
                            <div />
                          </div>
                          <div>
                            <div className="metric">{t('최대 집중 페이지')}</div>
                            <div className="text">{maxFocusPageName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
            <div className="share-state mt-3">
              <div className="graph-legend">
                <div>
                  <div className="shape">
                    <div className="rect-item user-cnt" />
                  </div>
                  <div className="label">참여자 수</div>
                </div>
                <div>
                  <div className="shape">
                    <div className="rect-item focus-count" />
                  </div>
                  <div className="label">참여자 집중도 (%)</div>
                </div>
                <div>
                  <div className="shape">
                    <div className="arrow-item chapter-move">
                      <div className="line" />
                      <div className="arrow" />
                    </div>
                  </div>
                  <div className="label">챕터 이동</div>
                </div>
                <div>
                  <div className="shape">
                    <div className="arrow-item page-move">
                      <div className="line" />
                      <div className="arrow" />
                    </div>
                  </div>
                  <div className="label">페이지 이동</div>
                </div>
                <div>
                  <div className="shape">
                    <div className="line-item max-user-line">
                      <div className="line" />
                    </div>
                  </div>
                  <div className="label">최대 사용자 수</div>
                </div>
                <div className="separator">
                  <div />
                </div>
                <div>
                  <div className="shape">
                    <div className="rect-item max-focus" />
                  </div>
                  <div className="label">최대 집중</div>
                </div>
                <div>
                  <div className="shape">
                    <div className="rect-item min-focus" />
                  </div>
                  <div className="label">최소 집중</div>
                </div>
              </div>
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
                      {!(share.shareTimeBuckets && share.shareTimeBuckets.length > 0) && (
                        <EmptyMessage
                          className="h5 h-100"
                          message={
                            <div>
                              <div className="h5">
                                <i className="fal fa-exclamation-circle" />
                              </div>
                              <div className="h6">{t('공유 로그가 없습니다')}</div>
                            </div>
                          }
                        />
                      )}
                    </div>
                    <div className="viewer">
                      {!(chapterChangedList && chapterChangedList.length > 0) && (
                        <div className="no-page-change">
                          <div>{t('공유된 챕터 및 페이지 정보가 없습니다.')}</div>
                        </div>
                      )}
                      {chapterChangedList && chapterChangedList.length > 0 && (
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
                                    data-html
                                    data-tip={this.getTimeTooltipData(
                                      chapterInfo.time,
                                      chapterChangedList.length - 1 > i ? chapterChangedList[i+1].time :  shareCloseDate,
                                      [chapterNames[Number(chapterInfo.chapterId)]],
                                    )}
                                    className={`${maxFocusChapterId === chapterInfo.chapterId ? 'max' : ''} ${
                                      minFocusChapterId === chapterInfo.chapterId ? 'min' : ''
                                    } change-item chapter-info`}
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
                                    data-html
                                    data-tip={this.getTimeTooltipData(
                                      pageInfo.time,
                                      pageChangedList.length - 1 > i ? pageChangedList[i+1].time :  shareCloseDate,
                                      [pageNames[Number(pageInfo.pageId)]],
                                    )}
                                    className={`${maxFocusPageId === pageInfo.pageId ? 'max' : ''} ${
                                      minFocusPageId === pageInfo.pageId ? 'min' : ''
                                    } change-item page-info`}
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
                      )}
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
                                    className={`graph-item ${item.time === minFocusTime ? 'min' : ''} ${
                                      item.time === maxFocusTime ? 'max' : ''
                                    }`}
                                    style={{
                                      width: `${itemWidth - 3}px`,
                                      left: `${scaleX(item.time)}px`,
                                    }}
                                    data-html
                                    data-tip={this.getTimeTooltipData(item.time, null, [`${item.userCnt} USERS`,`${item.focusPercentage}% FOCUSED`])}
                                  >
                                    {(item.time === maxFocusTime || item.time === minFocusTime) && (
                                      <div className="marker" />
                                    )}
                                    {item.userCnt > 0 && (
                                      <div
                                        className="focus-percentage"
                                        style={{
                                          bottom: `${graphHeight - scaleY(item.userCnt) + 3}px`,
                                        }}
                                      >
                                        <span>
                                          {item.userCnt ? `${item.focusPercentage}%` : ''}
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
                          {scaleY && max > 0 && (
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
  user: UserPropTypes,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareStat)));
