import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { setUserInfo } from 'actions';
import { FullLayout } from '@/layouts';
import { Button, Col, Popup, Row, SearchBar, ShareCard } from '@/components';
import request from '@/utils/request';
import common from '@/utils/common';
import { DIRECTIONS, ORDERS } from '@/constants/constants';
import { ShareEditorPopup } from '@/assets';
import './ShareList.scss';
import { convertInfo, convertUser } from '@/pages/Users/util';

class ShareList extends React.Component {
  init = false;

  constructor(props) {
    super(props);

    const {
      location: { search },
    } = this.props;

    const options = common.getOptions(search, ['order', 'direction', 'searchWord']);

    this.state = {
      options: {
        order: ORDERS[0].key,
        direction: DIRECTIONS[0].key,
        searchWord: '',
        ...options,
      },
      shares: [],
      accessCode: '',
      openShareEditorPopup: false,
      selectedTopicId: null,
      selectedShareId: null,
    };

    this.setOptionToUrl();
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      location: { search },
    } = this.props;

    const { options } = this.state;

    const pathOptions = common.getOptions(search, ['order', 'direction', 'searchWord']);

    if (!this.init) {
      this.getMyInfo();
    }

    if (!this.init || location !== prevProps.location) {
      this.init = true;
      this.getOpenShares({
        ...options,
        ...pathOptions,
      });
    }
  }

  getMyInfo = () => {
    const { setUserInfo: setUserInfoReducer } = this.props;
    request.get(
      '/api/users/my-info',
      null,
      (data) => {
        setUserInfoReducer(convertUser(data.user) || {}, data.grps);
      },
      () => {
        setUserInfoReducer({}, []);
      },
    );
  };

  getOpenShares = (options) => {
    request.get('/api/shares', { ...options }, (data) => {

      const next = data.shares.slice(0);
      for (let i=0; i<next.length; i+=1) {
        next[i].adminUserInfo = convertInfo(next[i].adminUserInfo);
      }

      this.setState({
        shares: next || [],
        options: {
          ...options,
        },
      });
    });
  };

  setOptionToUrl = () => {
    const {
      location: { pathname },
      history,
    } = this.props;

    const { options } = this.state;

    common.setOptions(history, pathname, options);
  };

  onConfigClick = (topicId, shareId) => {
    this.setState({
      openShareEditorPopup: true,
      selectedTopicId: topicId,
      selectedShareId: shareId,
    });
  };

  setOpenShareEditorPopup = (openShareEditorPopup) => {
    this.setState({
      openShareEditorPopup,
    });
  };

  stopShare = (shareId) => {
    request.put(`/api/shares/${shareId}/close`, null, (share) => {
      const { shares } = this.state;
      const next = shares.slice(0);
      const inx = next.findIndex((info) => info.id === share.id);
      next.splice(inx, 1);
      this.setState({
        shares: next,
        openShareEditorPopup: false,
      });
    });
  };

  onChangeShare = (share) => {
    const { shares } = this.state;
    const { user } = this.props;
    const next = shares.slice(0);

    if (share.privateYn && share.adminUserId !== user.id) {
      const inx = next.findIndex((info) => info.id === share.id);
      next.splice(inx, 1);
    } else {
      const inx = next.findIndex((info) => info.id === share.id);
      if (inx < 0) {
        next.push(share);
      } else {
        next[inx] = share;
      }
    }

    this.setState({
      shares: next,
    });
  };

  onCardClick = (shareId) => {
    const { history } = this.props;
    history.push(`/shares/${shareId}`);
  };

  render() {
    const { user, t } = this.props;

    const {
      options,
      options: { searchWord, order, direction },
      shares,
      accessCode,
      selectedTopicId,
      selectedShareId,
      openShareEditorPopup,
    } = this.state;

    return (
      <div className="open-share-list-wrapper">
        <SearchBar
          order={order}
          onChangeOrder={(value) => {
            this.setState(
              {
                options: {
                  ...options,
                  order: value,
                },
              },
              () => {
                this.setOptionToUrl();
              },
            );
          }}
          direction={direction}
          onChangeDirection={(value) => {
            this.setState(
              {
                options: {
                  ...options,
                  direction: value,
                },
              },
              () => {
                this.setOptionToUrl();
              },
            );
          }}
          searchPlaceholder={t('label.searchByTopicName')}
          onSearch={this.setOptionToUrl}
          onChangeSearchWord={(value) => {
            this.setState({
              options: {
                ...options,
                searchWord: value,
              },
            });
          }}
          searchWord={searchWord}
          onClear={() => {
            this.setState(
              {
                options: {
                  ...options,
                  searchWord: '',
                },
              },
              () => {
                this.setOptionToUrl();
              },
            );
          }}
        />
        <div className="access-code">
          <h4>액세스 코드로 참여하기</h4>
          <div className="access-code-input">
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
            <Button className="access-join-button">참여</Button>
          </div>
        </div>
        <FullLayout className="topic-list-content text-center align-self-center">
          <div className="topic-list">
            <Row>
              {shares.map((share, i) => {
                return (
                  <Col key={i} className="topic-col" xl={3} lg={4} md={6} sm={6}>
                    <ShareCard
                      share={share}
                      onConfigClick={
                        user && share.adminUserId === user.id
                          ? (topicId, shareId) => {
                              this.onConfigClick(topicId, shareId);
                            }
                          : null
                      }
                      onCardClick={(shareId, code) => {
                        this.onCardClick(shareId, code);
                      }}
                    />
                  </Col>
                );
              })}
            </Row>
          </div>
        </FullLayout>
        {openShareEditorPopup && selectedShareId && (
          <Popup title="토픽 공유 관리" open setOpen={this.setOpenShareEditorPopup}>
            <ShareEditorPopup
              topicId={selectedTopicId}
              shareId={selectedShareId}
              setOpen={this.setOpenShareEditorPopup}
              setStatusChange={(shareId) => {
                this.stopShare(shareId);
              }}
              onChangeShare={this.onChangeShare}
            />
          </Popup>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (user, grps) => dispatch(setUserInfo(user, grps)),
  };
};

ShareList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  setUserInfo: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ShareList)));
