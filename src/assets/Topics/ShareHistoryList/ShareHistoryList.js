import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { BottomButton, DateDuration, DateTime, EmptyMessage, Table } from '@/components';
import { SharePropTypes } from '@/proptypes';
import './ShareHistoryList.scss';

class ShareHistoryList extends React.PureComponent {
  render() {
    const { t, shares } = this.props;
    const { onList, onClick } = this.props;

    return (
      <div className="share-history-list-wrapper">
        <div className="share-list-content">
          {!(shares && shares.length > 0) && (
            <EmptyMessage
              className="h5 bg-white h-100"
              message={
                <div>
                  <div className="h1">
                    <i className="fal fa-exclamation-circle" />
                  </div>
                  <div>{t('토픽 공유 히스토리가 없습니다')}</div>
                </div>
              }
            />
          )}
          {shares && shares.length > 0 && (
            <div className="share-list scrollbar">
              <Table className="g-sticky" hover>
                <thead>
                  <tr>
                    <th className="id">{t('ID')}</th>
                    <th className="name">{t('이름')}</th>
                    <th className="open-yn">{t('열림')}</th>
                    <th className="started-yn">{t('진행중')}</th>
                    <th className="manager">{t('관리자')}</th>
                    <th className="user-count">{t('참여 인원')}</th>
                    <th className="current-info">{t('현재 페이지')}</th>
                    <th className="private-yn">{t('참여 방법')}</th>
                    <th className="last-open-date">{t('마지막 시작 일시')}</th>
                    <th className="duration">{t('공유 시간')}</th>
                  </tr>
                </thead>
                <tbody>
                  {shares.map((share) => {
                    const lastBucket =
                      share.shareTimeBuckets && share.shareTimeBuckets.length > 0
                        ? share.shareTimeBuckets[share.shareTimeBuckets.length - 1]
                        : {};
                    return (
                      <tr
                        key={share.id}
                        onClick={() => {
                          if (onClick) {
                            onClick(share.id);
                          }
                        }}
                      >
                        <td className="id">{share.id}</td>
                        <td className="name">{share.name}</td>
                        <td className="open-yn">
                          {share.openYn ? (
                            <span className="g-tag text-uppercase bg-success text-white">OPEN</span>
                          ) : (
                            <span className="g-tag text-uppercase bg-gray text-white">CLOSE</span>
                          )}
                        </td>
                        <td className="started-yn">
                          {share.startedYn ? (
                            <span className="g-tag text-uppercase bg-success text-white">START</span>
                          ) : (
                            <span className="g-tag text-uppercase bg-gray text-white">STOP</span>
                          )}
                        </td>
                        <td className="manager">{share.adminUserName}</td>
                        <td className="user-count">{share.offLineUserCount + share.onLineUserCount}명</td>
                        <td className="current-info">
                          <div>{share.currentChapterTitle}</div>
                          <div>{share.currentPageTitle}</div>
                        </td>
                        <td className="private-yn">
                          {share.privateYn ? (
                            <span className="g-tag text-uppercase bg-danger text-white">private</span>
                          ) : (
                            <span className="g-tag text-uppercase bg-success text-white">public</span>
                          )}
                        </td>
                        <td className="last-open-date">
                          <DateTime value={lastBucket.openDate} />
                        </td>
                        <td className="duration">
                          <DateDuration startValue={lastBucket.openDate} endValue={lastBucket.closeDate} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
        <BottomButton className="text-right mt-0" onList={onList} />
      </div>
    );
  }
}

ShareHistoryList.propTypes = {
  t: PropTypes.func,
  shares: PropTypes.arrayOf(SharePropTypes),
  onList: PropTypes.func,
  onClick: PropTypes.func,
};

export default withTranslation()(ShareHistoryList);
