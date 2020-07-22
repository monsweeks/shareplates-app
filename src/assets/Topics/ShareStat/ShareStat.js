import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { BottomButton, Card, CardBody, DateDuration, DateTime, SubLabel, Table } from '@/components';
import request from '@/utils/request';
import './ShareStat.scss';
import { convertUsers } from '@/pages/Users/util';

class ShareStat extends React.Component {
  timeAxis = React.createRef();

  scaleY = null;

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
      accessCode: {},
      shareTimeBucketId: null,

      chapterPageList: [],

      shareAccessList: [],
      sharePageChangeList: [],
      scaleX: null,
      startDate: null,
      endDate: null,
    };
  }

  componentDidMount() {
    const { shareId } = this.props;
    this.getShareInfo(shareId);
  }

  getShareInfo = (shareId) => {
    request.get(
      `/api/shares/${shareId}/detail`,
      null,
      (data) => {
        this.setData(data);
      },
      null,
      true,
    );
  };

  setData = (data) => {
    const next = { ...data };
    next.share.shareUsers = convertUsers(data.share.shareUsers);
    const { shareTimeBuckets } = next.share;
    const shareTimeBucketId = shareTimeBuckets && shareTimeBuckets.length > 0 ? shareTimeBuckets[0].id : null;
    this.setState(
      {
        accessCode: next.accessCode,
        share: next.share,
        shareTimeBucketId,
        topic: data.topic,
        chapterPageList: data.chapterPageList,
      },
      () => {
        if (shareTimeBucketId) {
          this.getShareTimeBucketData(shareTimeBucketId);
        }
      },
    );
  };

  getSampleData = (openDate, closeDate, max) => {
    const m = 1000 * 60;
    const start = Math.floor(new Date(openDate).getTime() / m) * m;
    const end = Math.floor(new Date(closeDate).getTime() / m) * m;
    let interval = (end - start) / 5;
    if (interval < m) {
      interval = m;
    }

    interval = Math.floor(interval / m) * m;

    const list = [];

    const min = max * 0.5;
    for (let time = start; time < end; time += interval) {
      const v = Math.floor(min + Math.random() * (max - min));
      list.push({
        time,
        joined: v,
        focus: v - Math.floor(Math.random() * (max * 0.2)),
        socket: Math.floor(min + Math.random() * (max - min)),
      });
    }

    return list;
  };

  getShareTimeBucketData = (shareTimeBucketId) => {
    const { share } = this.state;
    const { openDate, closeDate } = share.shareTimeBuckets.find((d) => d.id === shareTimeBucketId);

    request.get(
      `/api/stats/shares/${share.id}`,
      {
        startDate: openDate,
        endDate: closeDate,
      },
      (data) => {
        console.log(data);
        this.setState(
          {
            shareTimeBucketId,
            shareAccessList: data.ShareAccessInfo,
            sharePageChangeList: data.PageChangedInfo,
          },
          () => {
            this.draw();
          },
        );
      },
    );
  };

  draw = () => {
    const { share, shareTimeBucketId, shareAccessList } = this.state;
    const { openDate, closeDate } = share.shareTimeBuckets.find((d) => d.id === shareTimeBucketId);
    console.log(shareAccessList);
    this.drawTimeAxis(openDate, closeDate);
  };

  drawTimeAxis = (startDate, endDate) => {
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

      const scaleX = d3
        .scaleTime()
        .range([0, width])
        .domain([new Date(startDate), new Date(endDate)]);

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
        startDate,
        endDate,
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
      chapterPageList,
      sharePageChangeList,

      scaleX,
      startDate,
      endDate,
    } = this.state;
    const { t } = this.props;

    let totalShareMinutes = 0;
    if (share.shareTimeBuckets) {
      for (let i = 0; i < share.shareTimeBuckets.length; i += 1) {
        const now = new Date();
        const closeDate = share.shareTimeBuckets[i].closeDate || new Date(now.getTime());

        totalShareMinutes +=
          Math.round(
            ((new Date(closeDate).getTime() - new Date(share.shareTimeBuckets[i].openDate).getTime()) * 10) /
              (60 * 1000),
          ) / 10;
      }
    }

    let openDate = null;
    let closeDate = null;
    if (share.shareTimeBuckets) {
      openDate = share.shareTimeBuckets[0].openDate;
      closeDate = share.shareTimeBuckets[share.shareTimeBuckets.length - 1].openDate;
    }

    const currentSeq = this.getCurrentPageSequence(chapterPageList, share.currentChapterId, share.currentPageId);
    console.log(share, startDate, endDate);

    console.log(chapterPageList);

    const chapterChangeList = sharePageChangeList
      .filter((info, i) => {
        if (i < 1) {
          return true;
        }
        return sharePageChangeList[i - 1].chapterId !== info.chapterId;
      })
      .map((info) => {
        return {
          time: info.time,
          chapterId: info.chapterId,
        };
      });

    const chapterNames = {};
    const pageNames = {};
    chapterPageList.forEach((chapter) => {
      chapterNames[chapter.id] = chapter.title;
      chapter.pages.forEach((page) => {
        pageNames[page.id] = page.title;
      });
    });

    console.log(chapterChangeList);

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
                      <DateTime className="g-tag" value={openDate} />
                      <span className="g-tag">~</span>
                      <DateTime className="g-tag" value={closeDate} />
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
                        <div className="counter">
                          {currentSeq ? Math.round((currentSeq / topic.pageCount) * 1000) / 10 : ''}
                        </div>
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
              <div className="stat-summary">
                <SubLabel>{t('요약 정보')}</SubLabel>
                <Card>
                  <CardBody>
                    <div className="stat-summary-content">
                      <div className="count-info">
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
                        <div className="separator">
                          <div />
                        </div>
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
                            chapterChangeList.map((chapterInfo, i) => {
                              let endTime;
                              if (chapterChangeList[i + 1]) {
                                endTime = chapterChangeList[i + 1].time;
                              } else {
                                endTime = endDate;
                              }

                              const left = scaleX(new Date(chapterInfo.time));
                              const width = scaleX(new Date(endTime)) - scaleX(new Date(chapterInfo.time));

                              return (
                                <div
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
                            sharePageChangeList.map((pageInfo, i) => {
                              let endTime;
                              if (sharePageChangeList[i + 1]) {
                                endTime = sharePageChangeList[i + 1].time;
                              } else {
                                endTime = endDate;
                              }

                              const left = scaleX(new Date(pageInfo.time));
                              const width = scaleX(new Date(endTime)) - scaleX(new Date(pageInfo.time));

                              return (
                                <div
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
                        <div className="axis-y">세로축</div>
                        <div className="graph">캔들 차트</div>
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
