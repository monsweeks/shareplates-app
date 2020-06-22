import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, DateTime, P, Table, UserIcon } from '@/components';
import request from '@/utils/request';
import './ShareStatPopup.scss';
import { convertUsers } from '@/pages/Users/util';

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
        console.log(data);
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
    this.setState({
      accessCode: next.accessCode,
      share: next.share,
    });
  };

  render() {
    const { share, accessCode } = this.state;
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
                    {share.lastOpenDate && (
                      <>
                        <P className="bg-white mb-2">
                          <DateTime value={share.lastOpenDate} /> - <DateTime value={share.lastCloseDate} />
                        </P>
                      </>
                    )}
                  </div>
                </div>
                <div className="sub-title">
                  <span>공유 정보</span>
                </div>
                <div className="share-info-table">
                  <Table className="info-table">
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
                        <th>{t('참여 방법')}</th>
                        <td>
                          {share.privateYn ? (
                            <span className="g-tag text-uppercase bg-danger text-white">private</span>
                          ) : (
                            <span className="g-tag text-uppercase bg-success text-white">public</span>
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
                <div />
              </div>
              <div className="sub-title">
                <span>참여자 정보</span>
              </div>
              <div className="share-user-list scrollbar">
                <div>
                  <Table className="g-sticky">
                    <thead>
                      <tr>
                        <th className="icon"> </th>
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
                              <td className="name">
                                {!u.banYn ? (
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
            {t('취소')}
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
