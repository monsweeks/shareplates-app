import React from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FullLayout } from '@/layouts';
import SearchInput from '@/components/SearchInput/SearchInput';
import RadioButton from '@/components/RadioButton/RadioButton';
import CircleIcon from '@/components/CircleIcon/CircleIcon';
import { setPageColor, setUser } from '@/actions';
import { Card, CardBody, Col, Row, Selector } from '@/components';
import './TopicList.scss';
import variables from '@/styles/override-variables.scss';

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
      openOptions: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.organizationId && props.organizations && props.organizations.length > 0) {
      return {
        organizationId: props.organizations[0].id,
      };
    }

    return null;
  }

  componentDidMount() {
    const { setPageColor: setPageColorReducer } = this.props;
    setPageColorReducer(variables.seaBlueColor);
  }

  render() {
    const { order, direction, organizationId, openOptions } = this.state;
    // eslint-disable-next-line no-unused-vars
    const { organizations, setUser: setUserReducer, history } = this.props;

    return (
      <div className="topic-list-wrapper">
        <div className="g-no-select search-bar">
          <div>
            <div className="search-col">
              <SearchInput noBorder color='white' placeholder="토픽명으로 검색" />
            </div>
            {openOptions && (
              <div
                className="g-overlay"
                onClick={() => {
                  this.setState({
                    openOptions: false,
                  });
                }}
              />
            )}
            <div className={`options ${openOptions ? 'open' : ''}`}>
              <div className="arrow">
                <div />
              </div>
              <div className="organization-col">
                <span className="label small text-white">ORG</span>
                <Selector
                  outline
                  className="organization-selector"
                  items={organizations.map((org) => {
                    return {
                      key: org.id,
                      value: org.name,
                    };
                  })}
                  value={organizationId}
                  onChange={(id) => {
                    this.setState({
                      organizationId: id,
                    });
                  }}
                />
              </div>
              <div className="order-col">
                <span className="label small text-white">정렬</span>
                <RadioButton
                  circle
                  items={orders}
                  value={order}
                  onClick={(value) => {
                    this.setState({
                      order: value,
                    });
                  }}
                />
                <div className="separator" />
                <RadioButton
                  circle
                  items={directions}
                  value={direction}
                  onClick={(value) => {
                    this.setState({
                      direction: value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="config-col">
              <CircleIcon
                size="md"
                className="d-block d-md-none"
                icon={<i className="fal fa-ellipsis-h" />}
                onClick={() => {
                  this.setState({
                    openOptions: !openOptions,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <FullLayout className="topic-list-content text-center align-self-center">
          <div className="topic-list">
            <Row>
              <Col className="topic-col" xl={4} lg={4} md={6} sm={6}>
                <Card
                  className="g-no-select border-0"
                  onClick={() => {
                    history.push('/topics/new');
                  }}
                >
                  <CardBody>
                    <div>
                      <div className="new-topic-text">
                        <div className="icon">
                          <i className="fal fa-books" />
                        </div>
                        <div className="text">새로운 토픽</div>
                      </div>
                      <div className="new-topic-icon">
                        <i className="fal fa-plus" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
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
    setUser: (user, organizations) => dispatch(setUser(user, organizations)),
    setPageColor: (pageColor) => dispatch(setPageColor(pageColor)),
  };
};

TopicList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    picturePath: PropTypes.string,
  }),
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  setUser: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  setPageColor: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TopicList)));
