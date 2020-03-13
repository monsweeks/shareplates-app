import React from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import qs from 'qs';
import { withTranslation } from 'react-i18next';
import { FullLayout } from '@/layouts';
import { Col, Row, SearchBar, SocketClient, TopicCard } from '@/components';
import request from '@/utils/request';
import './TopicList.scss';

const orders = [
  {
    key: 'name',
    value: <i className="fal fa-sort-alpha-up"/>,
    tooltip: '이름으로 정렬',
  },
  {
    key: 'creationDate',
    value: <i className="fal fa-sort-numeric-up"/>,
    tooltip: '생성일시로 정렬',
  },
];

const directions = [
  {
    key: 'asc',
    value: <i className="fal fa-sort-amount-down"/>,
    tooltip: '오름차순으로 정렬',
  },
  {
    key: 'desc',
    value: <i className="fal fa-sort-amount-up"/>,
    tooltip: '내림차순으로 정렬',
  },
];

class TopicList extends React.Component {
  constructor(props) {
    super(props);

    const options = this.getOptions();
    this.state = {
      order: options.order ? options.order : orders[0].key,
      direction: options.direction ? options.direction : directions[0].key,
      organizationId: options.organizationId ? Number(options.organizationId) : null,
      searchWord: options.searchWord ? options.searchWord : '',
      topics: [],
    };
  }

  componentDidMount() {
    const { organizationId, searchWord, order, direction } = this.state;
    if (organizationId) {
      this.getTopics(organizationId, searchWord, order, direction);
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      const { organizationId, searchWord, order, direction } = this.state;
      this.getTopics(organizationId, searchWord, order, direction);
    }
  }

  getOptions = () => {
    const {
      location: { search },
    } = this.props;

    const options = {};
    const searchObject = qs.parse(search, { ignoreQueryPrefix: true });
    if (searchObject.organizationId) options.organizationId = searchObject.organizationId;
    if (searchObject.order) options.order = searchObject.order;
    if (searchObject.direction) options.direction = searchObject.direction;
    if (searchObject.searchWord) options.searchWord = searchObject.searchWord;

    return options;
  };

  getTopics = (organizationId, searchWord, order, direction) => {
    request.get(
      '/api/topics',
      { organizationId, searchWord, order, direction },
      (data) => {
        this.setState({
          topics: data.topics || [],
        });
      },
      () => {
        this.setState({
          topics: [],
        });
      },
    );
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.organizationId && props.organizations && props.organizations.length > 0) {
      return {
        organizationId: props.organizations[0].id,
      };
    }

    return null;
  }

  setOptionToUrl = () => {
    const {
      location: { pathname },
    } = this.props;

    const { organizationId, searchWord, order, direction } = this.state;

    const options = {
      order,
      direction,
      organizationId,
      searchWord,
    };

    const { history } = this.props;
    history.push({
      pathname,
      search: qs.stringify(options, { addQueryPrefix: true }),
    });
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
            this.setState({
              organizationId: id,
            }, () => {
              this.setOptionToUrl();
            });
          }}
          order={order}
          onChangeOrder={(value) => {
            this.setState({
              order: value,
            }, () => {
              this.setOptionToUrl();
            });
          }}
          direction={direction}
          onChangeDirection={(value) => {
            this.setState({
              direction: value,
            }, () => {
              this.setOptionToUrl();
            });
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
        <SocketClient topics={['/sub/topic']} successRecieveMessage={(msg) => this.createNewTopic(msg)}/>

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
    user: state.user.user,
    organizations: state.user.organizations,
  };
};

TopicList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),
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
