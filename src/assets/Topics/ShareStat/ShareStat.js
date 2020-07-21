import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
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
import { ShareProgressGraph } from '@/assets';

class ShareStat extends React.Component {
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
      shareGraphData: [],
      totalUserCount: 0,
      chapterPageList: [],
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

  getData = (shareId, startDate, endDate) => {
    request.get(
      `/api/stats/shares/${shareId}`,
      {
        startDate,
        endDate,
      },
      (data) => {
        console.log(data);
      },
    );
  };

  getShareTimeBucketData = (shareTimeBucketId) => {
    const { share } = this.state;
    const { openDate, closeDate } = share.shareTimeBuckets.find((d) => d.id === shareTimeBucketId);
    const maxPerson = Math.ceil(10 + Math.random() * 30);

    const condition = {
      shareId: share.id,
      startDate: openDate,
      endDate: closeDate,
    };
    console.log(condition);
    console.log(this.getData(share.id, openDate, closeDate));

    this.setState({
      shareTimeBucketId,
      shareGraphData: this.getSampleData(openDate, closeDate, maxPerson),
      totalUserCount: maxPerson,
    });
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
    const { share, accessCode, shareTimeBucketId, shareGraphData, totalUserCount, topic, chapterPageList } = this.state;
    const { t, user } = this.props;

    let totalShareMinutes = 0;
    if (share.shareTimeBuckets) {
      for (let i = 0; i < share.shareTimeBuckets.length; i += 1) {
        totalShareMinutes +=
          Math.round(
            ((new Date(share.shareTimeBuckets[i].closeDate).getTime() -
              new Date(share.shareTimeBuckets[i].openDate).getTime()) *
              10) /
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
    console.log(share);

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
                        <div className="counter">{currentSeq ? Math.round((currentSeq / topic.pageCount) * 1000) / 10 : ''}</div>
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
            <div className="left d-none">
              <div>
                <SubLabel className="mb-3">{t('타임 리스트')}</SubLabel>
                <div className="share-time-table">
                  <div>
                    {share.shareTimeBuckets && share.shareTimeBuckets.length > 0 && (
                      <Table hover>
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
                </div>
              </div>
            </div>
            <div className="right d-none">
              <SubLabel>{t('타임라인')}</SubLabel>
              <div className="timeline-graph">
                <div>
                  <ShareProgressGraph list={shareGraphData} max={totalUserCount} />
                </div>
              </div>
              <SubLabel>{t('공유 정보')}</SubLabel>
              <div className="share-info-table">
                <Table className="g-info-table">
                  <tbody>
                    <tr>
                      <th>{t('공유 관리자')}</th>
                      <td>
                        <span>{user && user.name}</span>
                        <span className="ml-2">{user && user.email}</span>
                      </td>
                    </tr>
                    <tr>
                      <th>{t('액세스 코드')}</th>
                      <td>{accessCode && accessCode.code}</td>
                    </tr>
                    <tr>
                      <th>{t('label.name')}</th>
                      <td>{share.name}</td>
                    </tr>
                    <tr>
                      <th>{t('메모')}</th>
                      <td>{share.memo}</td>
                    </tr>
                    <tr>
                      <th>{t('상태')}</th>
                      <td>
                        {share.privateYn ? (
                          <span className="g-tag text-uppercase bg-danger text-white">private</span>
                        ) : (
                          <span className="g-tag text-uppercase bg-success text-white">public</span>
                        )}
                        {share.openYn ? (
                          <span className="g-tag text-uppercase bg-success text-white ml-2">OPENED</span>
                        ) : (
                          <span className="g-tag text-uppercase bg-gray text-white ml-2">CLOSED</span>
                        )}
                        {share.startedYn ? (
                          <span className="g-tag text-uppercase bg-success text-white ml-2">STARTED</span>
                        ) : (
                          <span className="g-tag text-uppercase bg-gray text-white  ml-2">STOPPED</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <SubLabel>{t('참여자 정보')}</SubLabel>
              <div className="share-user-list scrollbar">
                <div>
                  {share.shareUsers && share.shareUsers.length > 0 && (
                    <Table className="g-sticky">
                      <thead>
                        <tr>
                          <th className="icon">&nbsp;</th>
                          <th className="email">{t('label.email')}</th>
                          <th className="name">{t('label.name')}</th>
                          <th className="share-role-code">{t('관리자')}</th>
                          <th className="ban-yn">{t('추방')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {share.shareUsers &&
                          share.shareUsers.map((u) => {
                            return (
                              <tr key={u.id}>
                                <td className="icon">
                                  <span className="user-icon">
                                    <UserIcon info={u.info} />
                                  </span>
                                </td>
                                <td className="email">{u.email}</td>
                                <td className="name">{u.name}</td>
                                <td className="share-role-code">
                                  {u.shareRoleCode === 'ADMIN' ? <i className="fad fa-medal" /> : ''}
                                </td>
                                <td className="ban-yn">
                                  {u.banYn ? (
                                    <span className="g-tag text-uppercase bg-danger text-white">banned</span>
                                  ) : (
                                    ''
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  )}
                  {!(share.shareUsers && share.shareUsers.length > 0) && (
                    <EmptyMessage
                      className="h-100 h5 bg-white"
                      message={
                        <div>
                          <div className="h1">
                            <i className="fal fa-exclamation-circle" />
                          </div>
                          <div>{t('참여자 정보가 없습니다')}</div>
                        </div>
                      }
                    />
                  )}
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
