import React from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FullLayout } from '@/layouts';
import { setUserAndOrganization } from '@/actions';
import { Col, Row, SearchBar, TopicCard } from '@/components';
import './TopicList.scss';
import request from '@/utils/request';

const orders = [
  {
    key: 'name',
    value: <i className="fal fa-sort-alpha-up" />,
    tooltip: '이름으로 정렬',
  },
  {
    key: 'creationTime',
    value: <i className="fal fa-sort-numeric-up" />,
    tooltip: '생성일시로 정렬',
  },
];

const directions = [
  {
    key: 'asc',
    value: <i className="fal fa-sort-amount-down" />,
    tooltip: '오름차순으로 정렬',
  },
  {
    key: 'desc',
    value: <i className="fal fa-sort-amount-up" />,
    tooltip: '내림차순으로 정렬',
  },
];

class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: orders[0].key,
      direction: directions[0].key,
      organizationId: null,
      topics: [],
    };
  }

  componentDidMount() {
    this.getTopics();
  }

  getTopics = () => {
    request.get(
      '/api/topics',
      null,
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

  render() {
    const { order, direction, organizationId, topics } = this.state;
    // eslint-disable-next-line no-unused-vars
    const { organizations, setUserAndOrganization: setUserAndOrganizationReducer, history } = this.props;

    return (
      <div className="topic-list-wrapper">
        <SearchBar
          organizations={organizations}
          organizationId={organizationId}
          onChangeOrganization={(id) => {
            this.setState({
              organizationId: id,
            });
          }}
          order={order}
          onChangeOrder={(id) => {
            this.setState({
              organizationId: id,
            });
          }}
          direction={direction}
          onChangeDirection={(value) => {
            this.setState({
              direction: value,
            });
          }}
        />
        <FullLayout className="topic-list-content text-center align-self-center">
          <div className="topic-list">
            <Row>
              {topics.map((topic, i) => {
                return (
                  <Col key={i} className="topic-col" xl={4} lg={4} md={6} sm={6}>
                    <TopicCard
                      topic={topic}
                      onCardClick={(id) => {
                        console.log(id);
                      }}
                      onConfigClick={(id) => {
                        console.log(id);
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

const mapDispatchToProps = (dispatch) => {
  return {
    setUserAndOrganization: (user, organizations) => dispatch(setUserAndOrganization(user, organizations)),
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
  setUserAndOrganization: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TopicList)));
