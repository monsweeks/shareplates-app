import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Button, DateTime, EmptyMessage } from '@/components';
import request from '@/utils/request';
import './ShareHistoryListPopup.scss';
import dialog from '@/utils/dialog';
import { MESSAGE_CATEGORY } from '@/constants/constants';
import { SharePropTypes } from '@/proptypes';

class ShareHistoryListPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  stopShare = (shareId) => {
    request.put(`/api/shares/${shareId}/close`, {}, (data) => {
      const { changeShare } = this.props;
      changeShare(data);
    });
  };

  deleteShare = (shareId) => {
    dialog.setConfirm(MESSAGE_CATEGORY.WARNING, '데이터 삭제 경고', '공유 이력을 정말 삭제하시겠습니까?', () => {
      request.del(`/api/shares/${shareId}`, {}, (data) => {
        const { deleteShare } = this.props;
        deleteShare(data);
      });
    });
  };

  render() {
    const { t, shares, setOpen, openShare, topicId } = this.props;

    return (
      <div className="share-history-list-popup-wrapper">
        <div className="share-list-content">
          <div className="share-list">
            <div className="scrollbar d-flex">
              {!(shares && shares.length > 0) && (
                <EmptyMessage
                  className="h5 bg-white"
                  message={
                    <div>
                      <div className="h1">
                        <i className="fal fa-exclamation-circle" />
                      </div>
                      <div>{t('토픽 공유 이력이 없습니다')}</div>
                    </div>
                  }
                />
              )}
              {shares && shares.length > 0 && (
                <ul>
                  <li className="header">
                    <div className="name">이름</div>
                    <div className="page-title">현재 페이지</div>
                    <div className="private-yn">참여 방법</div>
                    <div className="open-date">마지막 시작 일시</div>
                    <div className="close-date">마지막 종료 일시</div>
                    <div className="control" />
                  </li>
                  {shares.map((info) => {
                    const lastBucket = info.shareTimeBuckets && info.shareTimeBuckets.length > 0 ? info.shareTimeBuckets[info.shareTimeBuckets.length - 1] : {};
                    return (
                      <li key={info.id}>
                        <div className="name">{info.name}</div>
                        <div className="page-title">
                          {info.currentPageTitle} ({info.currentChapterTitle})
                        </div>
                        <div className="private-yn">{info.privateYn ? '엑세스 코드' : '누구나 참여'}</div>
                        <div className="open-date">
                          <DateTime value={lastBucket.openDate} />
                        </div>
                        <div className="close-date">
                          <DateTime value={lastBucket.closeDate} />
                        </div>
                        <div className="control">
                          {info.openYn && (
                            <Button
                              size="sm"
                              onClick={() => {
                                this.stopShare(info.id);
                              }}
                            >
                              중지
                            </Button>
                          )}
                          {!info.openYn && (
                            <Button
                              className="mr-2"
                              color="danger"
                              size="sm"
                              onClick={() => {
                                this.deleteShare(info.id);
                              }}
                            >
                              삭제
                            </Button>
                          )}
                          {!info.openYn && (
                            <Button
                              color="primary"
                              size="sm"
                              onClick={() => {
                                openShare(topicId, info.id);
                              }}
                            >
                              선택
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="popup-buttons">
          <Button
            className="px-4 mr-2"
            color="secondary"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            {t('취소')}
          </Button>
          <Button
            className="px-4"
            color="primary"
            onClick={() => {
              openShare(topicId, null);
            }}
          >
            {t('새로운 토픽 공유')}
          </Button>
        </div>
      </div>
    );
  }
}

ShareHistoryListPopup.propTypes = {
  t: PropTypes.func,
  shares: PropTypes.arrayOf(SharePropTypes),
  setOpen: PropTypes.func,
  changeShare: PropTypes.func,
  openShare: PropTypes.func,
  deleteShare: PropTypes.func,
  topicId: PropTypes.number,
};

export default withTranslation()(ShareHistoryListPopup);
