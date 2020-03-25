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

    const options = common.getOptions(search, ['order', 'direction', 'organizationId', 'searchWord']);

    this.state = {
      options: {
        order: ORDERS[0].key,
        direction: DIRECTIONS[0].key,
        organizationId: null,
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
      options: { organizationId },
    } = this.state;
    if (organizationId) {
      this.getTopics(options);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.init && state.options.organizationId) {
      return {
        init: true,
      };
    }

    if (!state.init && !state.options.organizationId && props.organizations && props.organizations.length > 0) {
      return {
        options: {
          ...state.options,
          organizationId: props.organizations[0].id,
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
      options: { organizationId },
      init,
    } = this.state;

    if (!init) {
      return;
    }

    const pathOptions = common.getOptions(search, ['order', 'direction', 'organizationId', 'searchWord']);

    if (!pathOptions.organizationId) {
      pathOptions.organizationId = organizationId;
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
    const { organizations, history, t } = this.props;

    const {
      options,
      options: { organizationId, searchWord, order, direction },
      topics,
    } = this.state;

    return (
      <div className="topic-list-wrapper">
        <SearchBar
          organizations={organizations}
          organizationId={organizationId}
          onChangeOrganization={(id) => {
            this.setState(
              {
                options: {
                  ...options,
                  organizationId: id,
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
                    history.push('/topics/new');
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
    organizations: state.user.organizations,
  };
};

TopicList.propTypes = {
  organizations: PropTypes.arrayOf(
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
