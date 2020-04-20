import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { setConfirm } from 'actions';
import { connect } from 'react-redux';
import './ShareList.scss';
import { Button, DateTime, EmptyMessage } from '@/components';
import request from '@/utils/request';

class ShareList extends React.Component {
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
    const { setConfirm: setConfirmReducer } = this.props;

    setConfirmReducer('공유 이력을 정말 삭제하시겠습니까?', () => {
      request.del(`/api/shares/${shareId}`, {}, (data) => {
        const { deleteShare } = this.props;
        deleteShare(data);
      });
    });
  };

  render() {
    const { t, shares, setOpen, openShare, topicId } = this.props;

    return (
      <div className="share-list-wrapper">
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
                    return (
                      <li key={info.id}>
                        <div className="name">{info.name}</div>
                        <div className="page-title">{info.currentPageTitle} ({info.currentChapterTitle})</div>
                        <div className="private-yn">{info.privateYn ? '엑세스 코드' : '누구나 참여'}</div>
                        <div className="open-date">
                          <DateTime value={info.lastOpenDate} />
                        </div>
                        <div className="close-date">
                          <DateTime value={info.lastCloseDate} />
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

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
  };
};

ShareList.propTypes = {
  t: PropTypes.func,
  shares: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      privateYn: PropTypes.bool,
      openYn: PropTypes.bool,
      currentChapterTitle: PropTypes.string,
      currentPageTitle: PropTypes.string,
      lastOpenDate: PropTypes.string,
      lastCloseDate: PropTypes.string,
    }),
  ),
  setOpen: PropTypes.func,
  changeShare: PropTypes.func,
  openShare: PropTypes.func,
  deleteShare: PropTypes.func,
  topicId: PropTypes.number,
  setConfirm: PropTypes.func,
};

export default withTranslation()(connect(undefined, mapDispatchToProps)(ShareList));
