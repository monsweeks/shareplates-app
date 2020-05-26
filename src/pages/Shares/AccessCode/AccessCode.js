import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { DetailLayout } from '@/layouts';
import { Button, EmptyMessage } from '@/components';
import request from '@/utils/request';
import './AccessCode.scss';

class AccessCode extends React.Component {
  init = false;

  constructor(props) {
    super(props);
    const {
      match: {
        params: { shareId },
      },
    } = this.props;

    this.state = {
      shareId,
      shareStatus: null,
      accessCode: '',
      joinResult: true,
    };
  }

  componentDidMount() {
    const { shareId } = this.state;
    const { user } = this.props;
    if (user && shareId && !this.init) {
      this.init = true;
      this.getShareStatus(shareId);
    }
  }

  componentDidUpdate() {
    const { shareId } = this.state;
    const { user } = this.props;
    if (user && shareId && !this.init) {
      this.init = true;
      this.getShareStatus(shareId);
    }
  }

  getShareStatus = (shareId) => {
    request.get(
      `/api/shares/${shareId}/status`,
      null,
      (shareStatus) => {
        const { history } = this.props;
        // 프라이빗이 아니라면 바로 이동
        if (shareStatus && shareStatus.openYn && !shareStatus.privateYn) {
          history.push(`/shares/${shareId}`);
        } else {
          this.setState({
            shareStatus,
          });
        }
      },
      (error, response) => {
        this.setState({
          shareStatus: false,
        });
        if (response.data.code !== 'SHARE_NOT_EXISTS_SHARE') {
          request.processError(error);
        }
      },
    );
  };

  onJoin = () => {
    const { accessCode, shareId } = this.state;
    const { t, history } = this.props;

    if (!accessCode && accessCode.length < 1) {
      this.setState({
        joinResult: t('엑세스 코드를 입력해주세요'),
      });
      return;
    }

    const formData = new FormData();
    formData.append('accessCode', accessCode);

    request.post(
      `/api/shares/${shareId}/register`,
      formData,
      (share) => {
        history.push(`/shares/${share.id}`);
      },
      (error, response) => {
        if (response.data.code === 'SHARE_NOT_EXISTS_SHARE') {
          this.setState({
            joinResult: t('공유가 종료된 토픽이거나, 찾을 수 없는 토픽입니다.'),
          });
        } else {
          request.processError(error);
        }
      },
    );
  };

  render() {
    const { t } = this.props;
    const { accessCode, joinResult, shareStatus } = this.state;

    return (
      <DetailLayout className="access-code-wrapper m-0 p-0 bg-transparent">
        {!(shareStatus && shareStatus.openYn) && (
          <EmptyMessage
            className="h5 text-white"
            message={
              <div>
                {shareStatus === null && <div>{t('잠시만 기다려주세요')}</div>}
                {shareStatus === false && <div>{t('공유가 종료된 토픽이거나, 찾을 수 없는 토픽입니다.')}</div>}
                {shareStatus && shareStatus.openYn === false && <div>{t('공유가 종료된 토픽입니다.')}</div>}
              </div>
            }
          />
        )}
        {shareStatus && shareStatus.openYn && (
          <div className="access-code-content">
            <div className="access-code-message">{t('참여하려는 토픽의 엑세스 코드를 입력해주세요')}</div>
            <div className={`access-result-message ${joinResult === true ? '' : 'in-valid'}`}>
              <span>{joinResult === true ? '비공개 토픽은 엑세스 코드를 통해서만 접근이 가능합니다' : joinResult}</span>
            </div>
            <div className="access-code-input">
              <Button
                onClick={() => {
                  this.setState({
                    accessCode: '',
                  });
                }}
                color="transparent"
                className="text-white clear-button"
              >
                <i className="fal fa-times" />
              </Button>
              <input
                type="text"
                value={accessCode}
                maxLength={6}
                onChange={(e) => {
                  this.setState({
                    accessCode: e.target.value,
                  });
                }}
              />
            </div>
            <div className="access-code-button">
              <Button onClick={this.onJoin}>참여</Button>
            </div>
          </div>
        )}
      </DetailLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

AccessCode.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      shareId: PropTypes.string,
    }),
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(AccessCode)));
