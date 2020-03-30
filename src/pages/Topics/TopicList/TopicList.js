import React from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FullLayout } from '@/layouts';
import { Col, Row, SearchBar, SocketClient, TopicCard } from '@/components';
import request from '@/utils/request';
import common from '@/utils/common';
import { DIRECTIONS, ORDERS } from '@/constants/constants';
import './TopicList.scss';

class TopicList extends React.Component {
  constructor(props) {
    super(props);

    const {
      location: { search },
    } = this.props;

    const options = common.getOptions(search, ['order', 'direction', 'grpId', 'searchWord']);

    this.state = {
      options: {
        order: ORDERS[0].key,
        direction: DIRECTIONS[0].key,
        grpId: null,
        searchWord: '',
        ...options,
      },
      topics: [],
      init: false,
    };

    this.setOptionToUrl();
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

  static getDerivedStateFromProps(props, state) {
    if (!state.init && state.options.grpId) {
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

  render() {
    const { grps, history, t } = this.props;

    const {
      options,
      options: { grpId, searchWord, order, direction },
      topics,
    } = this.state;

    return (
      <div className="topic-list-wrapper">
        <SearchBar
          grps={grps}
          grpId={grpId}
          onChangeGrp={(id) => {
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
                  <Col key={i} className="topic-col" xl={4} lg={4} md={6} sm={6}>
                    <TopicCard
                      topic={topic}
                      onCardClick={(topicId) => {
                        history.push(`/topics/${topicId}/chapters`);
                      }}
                      onConfigClick={(topicId) => {
                        history.push(`/topics/${topicId}`);
                      }}
                    />
                  </Col>
                );
              })}
              <Col className="topic-col" xl={4} lg={4} md={6} sm={6}>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    grps: state.user.grps,
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
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(TopicList)));
