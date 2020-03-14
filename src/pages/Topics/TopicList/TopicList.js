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
      order: ORDERS[0].key,
      direction: DIRECTIONS[0].key,
      organizationId: null,
      searchWord: '',
      topics: [],
      ...options,
    };
  }

  componentDidMount() {
    const { organizationId, searchWord, order, direction } = this.state;
    if (organizationId) {
      this.getTopics(organizationId, searchWord, order, direction);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.organizationId && props.organizations && props.organizations.length > 0) {
      return {
        organizationId: props.organizations[0].id,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props;
    const { organizationId, searchWord, order, direction } = this.state;

    if (
      (prevState.organizationId === null && prevState.organizationId !== organizationId) ||
      location !== prevProps.location
    ) {
      this.getTopics(organizationId, searchWord, order, direction);
    }
  }

  getTopics = (organizationId, searchWord, order, direction) => {
    request.get('/api/topics', { organizationId, searchWord, order, direction }, (data) => {
      this.setState({
        topics: data.topics || [],
      });
    });
  };

  setOptionToUrl = () => {
    const {
      location: { pathname },
      history,
    } = this.props;

    const { organizationId, searchWord, order, direction } = this.state;

    const options = {
      order,
      direction,
      organizationId,
      searchWord,
    };

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
    const { order, direction, organizationId, topics, searchWord } = this.state;
    const { organizations, history, t } = this.props;

    return (
      <div className="topic-list-wrapper">
        <SearchBar
          organizations={organizations}
          organizationId={organizationId}
          onChangeOrganization={(id) => {
            this.setState(
              {
                organizationId: id,
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
                order: value,
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
                direction: value,
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
              searchWord: value,
            });
          }}
          searchWord={searchWord}
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
