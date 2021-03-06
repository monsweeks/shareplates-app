import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { setGrp, setUserInfo } from 'actions';
import { FullLayout } from '@/layouts';
import { Col, Popup, Row, SearchBar } from '@/components';
import request from '@/utils/request';
import common from '@/utils/common';
import { DIRECTIONS, ORDERS } from '@/constants/constants';
import { ShareEditorPopup, ShareHistoryListPopup, TopicCard } from '@/assets';
import './TopicList.scss';
import { convertUser } from '@/pages/Users/util';
import { UserPropTypes } from '@/proptypes';

class TopicList extends React.Component {
  constructor(props) {
    super(props);

    const {
      location: { search },
    } = this.props;

    const { grpId: globalGropId } = this.props;

    const options = common.getOptions(search, ['order', 'direction', 'grpId', 'searchWord']);

    this.state = {
      options: {
        order: ORDERS[0].key,
        direction: DIRECTIONS[0].key,
        grpId: globalGropId,
        searchWord: '',
        ...options,
      },
      topics: [],
      initGrp: false,
      openShareEditorPopup: false,
      openShareListPopup: false,
      selectedTopicId: null,
      selectedShareId: null,
      shares: [],
    };

    this.setOptionToUrl();
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.initGrp && state.options.grpId) {
      props.setGrp(Number(state.options.grpId));
      return {
        initGrp: true,
      };
    }

    if (!state.initGrp && !state.options.grpId && props.grps && props.grps.length > 0) {
      return {
        options: {
          ...state.options,
          grpId: props.grps[0].id,
        },
        initGrp: true,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      location,
      location: { search },
    } = this.props;

    const {
      options,
      options: { grpId },
      initGrp,
    } = this.state;

    if (!initGrp) {
      return;
    }

    const pathOptions = common.getOptions(search, ['order', 'direction', 'grpId', 'searchWord']);

    if (!pathOptions.grpId) {
      pathOptions.grpId = grpId;
    }

    if ((!prevState.initGrp && initGrp) || location !== prevProps.location) {
      this.getMyInfo();
      this.getTopics({
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
        setUserInfoReducer(convertUser(data.user) || {}, data.grps, data.shareCount);
      },
      () => {
        setUserInfoReducer({}, [], 0);
      },
    );
  };

  getTopics = (options) => {
    const { grpId, ...last } = options;
    request.get(`/api/groups/${grpId}/topics`, { ...last }, (data) => {
      this.setState({
        topics: data.topics || [],
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

  createShareOrOpenPopup = (topicId) => {
    request.get(`/api/topics/${topicId}/shares`, null, (data) => {
      if (data.shares && data.shares.length < 1) {
        this.setState({
          openShareEditorPopup: true,
          selectedTopicId: topicId,
        });
      } else {
        this.setState({
          shares: data.shares,
          openShareListPopup: true,
          selectedTopicId: topicId,
        });
      }
    });
  };

  setOpenShareEditorPopup = (openShareEditorPopup) => {
    this.setState({
      openShareEditorPopup,
    });
  };

  setOpenShareListPopup = (openShareListPopup) => {
    this.setState({
      openShareListPopup,
    });
  };

  changeShare = (share) => {
    const { shares } = this.state;
    const next = shares.slice(0);
    const inx = next.findIndex((info) => info.id === share.id);
    next[inx] = share;
    this.setState({
      shares: next,
    });
  };

  deleteShare = (share) => {
    const { shares } = this.state;
    const next = shares.slice(0);
    const inx = next.findIndex((info) => info.id === share.id);
    next.splice(inx, 1);
    this.setState({
      shares: next,
    });
  };

  openShare = (topicId, shareId) => {
    this.setState({
      openShareEditorPopup: true,
      openShareListPopup: false,
      selectedTopicId: topicId,
      selectedShareId: shareId,
    });
  };

  render() {
    const { grps, history, t, setGrp: setGrpAction, user } = this.props;

    const {
      options,
      options: { grpId, searchWord, order, direction },
      topics,
      openShareEditorPopup,
      selectedTopicId,
      shares,
      openShareListPopup,
      selectedShareId,
    } = this.state;

    return (
      <div className="topic-list-wrapper">
        <SearchBar
          grps={grps}
          grpId={grpId}
          onChangeGrp={(id) => {
            setGrpAction(id);
            this.setState(
              {
                options: {
                  ...options,
                  grpId: id,
                },
              },
              () => {
                this.setOptionToUrl();
              },
            );
          }}
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
        <FullLayout className="topic-list-content text-center align-self-center">
          <div className="topic-list">
            <Row>
              {topics.map((topic, i) => {
                return (
                  <Col key={i} className="topic-col" xl={3} lg={4} md={6} sm={6}>
                    <TopicCard
                      isAdmin={user.activeRoleCode === 'SUPER_MAN'}
                      topic={topic}
                      onInfoClick={(topicId) => {
                        history.push(`/topics/${topicId}`);
                      }}
                      onContentClick={(topicId) => {
                        history.push(`/topics/${topicId}/chapters`);
                      }}
                      onShareClick={(topicId) => {
                        this.createShareOrOpenPopup(topicId);
                      }}
                    />
                  </Col>
                );
              })}
              <Col className="topic-col" xl={3} lg={4} md={6} sm={6}>
                <TopicCard
                  newCard
                  onCardClick={() => {
                    history.push(`/topics/new?grpId=${grpId}`);
                  }}
                />
              </Col>
            </Row>
          </div>
        </FullLayout>
        {openShareEditorPopup && selectedTopicId && (
          <Popup title="토픽을 공유를 시작합니다" open setOpen={this.setOpenShareEditorPopup}>
            <ShareEditorPopup
              topicId={selectedTopicId}
              shareId={selectedShareId}
              setOpen={this.setOpenShareEditorPopup}
            />
          </Popup>
        )}
        {openShareListPopup && (
          <Popup title="토픽 공유 정보" open setOpen={this.setOpenShareListPopup}>
            <ShareHistoryListPopup
              shares={shares}
              changeShare={this.changeShare}
              setOpen={this.setOpenShareListPopup}
              openShare={this.openShare}
              deleteShare={this.deleteShare}
              topicId={selectedTopicId}
            />
          </Popup>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    grps: state.user.grps,
    grpId: state.user.grpId,
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGrp: (grpId) => dispatch(setGrp(grpId)),
    setUserInfo: (user, grps, shareCount) => dispatch(setUserInfo(user, grps, shareCount)),
  };
};

TopicList.propTypes = {
  grps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  setUserInfo: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
  setGrp: PropTypes.func,
  grpId: PropTypes.number,
  user: UserPropTypes,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TopicList)));
