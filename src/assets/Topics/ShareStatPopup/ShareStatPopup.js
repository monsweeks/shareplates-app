import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, DateDuration, DateTime, EmptyMessage, Table, UserIcon } from '@/components';
import request from '@/utils/request';
import './ShareStatPopup.scss';
import { convertUsers } from '@/pages/Users/util';
import { ShareProgressGraph } from '@/assets';

class ShareStatPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  onChange = (field, value) => {
    const { share } = this.state;
    const next = { ...share };
    next[field] = value;

    this.setState({
      share: next,
    });
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
    request.get(`/api/stats/shares/${shareId}`, {
      startDate,
      endDate
    }, (data) => {
      console.log(data);
    });
  };

  getShareTimeBucketData = (shareTimeBucketId) => {
    const { share } = this.state;
    const { openDate, closeDate } = share.shareTimeBuckets.find((d) => d.id === shareTimeBucketId);
    const maxPerson = Math.ceil(10 + Math.random() * 30);

    const condition = {
      shareId : share.id,
      startDate : openDate,
      endDate : closeDate,
    };
    console.log(condition);
    console.log(this.getData(share.id, openDate, closeDate));

    this.setState({
      shareTimeBucketId,
      shareGraphData: this.getSampleData(openDate, closeDate, maxPerson),
      totalUserCount: maxPerson,
    });
  };

  render() {
    const { share, accessCode, shareTimeBucketId, shareGraphData, totalUserCount } = this.state;
    const { t, user, setOpen } = this.props;

    return (
      <div className="share-state-popup-wrapper">
        {share && (
          <div className="share-state-content">
            <div className="left">
              <div>
                <div className="sub-title">
                  <span>타임 리스트</span>
                </div>
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
                <div className="sub-title">
                  <span>공유 정보</span>
                </div>
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
              </div>
            </div>
            <div className="right">
              <div className="sub-title">
                <span>타임라인</span>
              </div>
              <div className="timeline-graph">
                <div>
                  <ShareProgressGraph list={shareGraphData} max={totalUserCount} />
                </div>
              </div>
              <div className="sub-title">
                <span>참여자 정보</span>
              </div>
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
        <div className="popup-buttons bg-light">
          <Button
            className="px-4 mr-2"
            color="secondary"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            {t('닫기')}
          </Button>
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

ShareStatPopup.propTypes = {
  t: PropTypes.func,
  shareId: PropTypes.number,
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  setOpen: PropTypes.func,

  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(ShareStatPopup)));
