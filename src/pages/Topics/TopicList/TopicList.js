import React from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FullLayout } from '@/layouts';
import { Col, Popup, Row, SearchBar, SocketClient, TopicCard } from '@/components';
import request from '@/utils/request';
import common from '@/utils/common';
import { DIRECTIONS, ORDERS } from '@/constants/constants';
import './TopicList.scss';
import { setGrp } from '@/actions';
import NewShare from '@/pages/Topics/TopicList/NewShare';

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
      init: false,
      openNewSharePopup: false,
      selectedTopicId: null,
    };

    this.setOptionToUrl();
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.init && state.options.grpId) {
      props.setGrp(Number(state.options.grpId));
      return {
        init: true,
      };
    }

    if (!state.init && !state.options.grpId && props.grps && props.grps.length > 0) {
      return {
        options: {
          ...state.options,
          grpId: props.grps[0].id,
        },
        init: true,
      };
    }

    return null;
  }

  componentDidMount() {
    const {
      options,
      options: { grpId },
    } = this.state;

    if (grpId) {
      this.getTopics(options);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      location,
      location: { search },
    } = this.props;

    const {
      options,
      options: { grpId },
      init,
    } = this.state;

    if (!init) {
      return;
    }

    const pathOptions = common.getOptions(search, ['order', 'direction', 'grpId', 'searchWord']);

    if (!pathOptions.grpId) {
      pathOptions.grpId = grpId;
    }

    if ((!prevState.init && init) || location !== prevProps.location) {
      this.getTopics({
        ...options,
        ...pathOptions,
      });
    }
  }

  getTopics = (options) => {
    request.get('/api/topics', { ...options }, (data) => {
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

  createNewTopic = (topic) => {
    const { topics } = this.state;
    switch (topic.statusCode) {
      case 'CREATE':
        this.setState((prevState) => ({
          topics: [...prevState.topics, topic],
        }));
        break;

      case 'UPDATE':
        topics.forEach((t, idx) => {
          if (t.id === topic.id) {
            topics[idx] = topic;
          }
        });
        this.setState({
          topics,
        });
        break;

      case 'DELETE':
        this.setState((prevState) => ({
          topics: [...prevState.topics, topic],
        }));
        break;
      default:
    }
  };

  createShareOrOpenPopup = (topicId) => {
    request.get(`/api/topics/${topicId}/shares`, null, (data) => {
      console.log(data);
      // if (data.shares && data.shares.length < 1) {
        this.setState({
          openNewSharePopup: true,
          selectedTopicId: topicId,
        });
      // }
    });
  };

  setOpenNewSharePopup = (openNewSharePopup) => {
    this.setState({
      openNewSharePopup,
    });
  };

  render() {
    const { grps, history, t, setGrp: setGrpAction } = this.props;

    const {
      options,
      options: { grpId, searchWord, order, direction },
      topics,
      openNewSharePopup,
      selectedTopicId,
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
        <SocketClient topics={['/sub/topic']} successRecieveMessage={(msg) => this.createNewTopic(msg)} />
        <FullLayout className="topic-list-content text-center align-self-center">
          <div className="topic-list">
            <Row>
              {topics.map((topic, i) => {
                return (
                  <Col key={i} className="topic-col" xl={3} lg={4} md={6} sm={6}>
                    <TopicCard
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
        {openNewSharePopup && selectedTopicId && (
          <Popup title="토픽을 공유를 시작합니다" open setOpen={this.setOpenNewSharePopup}>
            <NewShare topicId={selectedTopicId} setOpen={this.setOpenNewSharePopup} />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGrp: (grpId) => dispatch(setGrp(grpId)),
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
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TopicList)));
