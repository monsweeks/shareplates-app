import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FullLayout } from '@/layouts';
import { Col, OrganizationCard, Row, SearchBar } from '@/components';
import './OrganizationList.scss';
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

class OrganizationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: orders[0].key,
      direction: directions[0].key,
      searchWord: '',
      organizations: [],
    };
  }

  componentDidMount() {
    const { searchWord, order, direction } = this.state;
    this.getOrganizations(searchWord, order, direction);
  }

  getOrganizations = (searchWord, order, direction) => {
    request.get(
      '/api/organizations',
      { searchWord, order, direction },
      (organizations) => {
        console.log(organizations);
        this.setState({
          organizations,
        });
      },
      () => {
        this.setState({
          organizations: [],
        });
      },
    );
  };

  onSearch = () => {
    const { searchWord, order, direction } = this.state;
    this.getOrganizations(searchWord, order, direction);
  };

  render() {
    const { order, direction, organizations } = this.state;
    const { history, t } = this.props;

    return (
      <div className="organization-list-wrapper">
        <SearchBar
          order={order}
          onChangeOrder={(value) => {
            this.setState({
              order: value,
            });
          }}
          direction={direction}
          onChangeDirection={(value) => {
            this.setState({
              direction: value,
            });
          }}
          onSearch={this.onSearch}
          onChangeSearchWord={(value) => {
            this.setState({
              searchWord: value,
            });
          }}
          searchPlaceholder={t('label.searchByOrgName')}
        />
        <FullLayout className="organization-list-content text-center align-self-center">
          <div className="organization-list">
            <Row>
              {organizations.map((organization, i) => {
                return (
                  <Col key={i} className="organization-col" xl={4} lg={4} md={6} sm={6}>
                    <OrganizationCard
                      organization={organization}
                      onCardClick={(organizationId) => {
                        history.push(`/organizations/${organizationId}/chapters`);
                      }}
                      onConfigClick={(organizationId) => {
                        history.push(`/organizations/${organizationId}`);
                      }}
                    />
                  </Col>
                );
              })}
              <Col className="organization-col" xl={4} lg={4} md={6} sm={6}>
                <OrganizationCard
                  newCard
                  onCardClick={() => {
                    history.push('/organizations/new');
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
  };
};

OrganizationList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
  }),

  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(OrganizationList)));
