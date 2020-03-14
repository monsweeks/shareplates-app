import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FullLayout } from '@/layouts';
import { Col, OrganizationCard, Row, SearchBar } from '@/components';
import request from '@/utils/request';
import common from '@/utils/common';
import { DIRECTIONS, ORDERS } from '@/constants/constants';
import './OrganizationList.scss';

class OrganizationList extends React.Component {
  constructor(props) {
    super(props);

    const {
      location: { search },
    } = this.props;

    const options = common.getOptions(search, ['order', 'direction', 'organizationId', 'searchWord']);

    this.state = {
      order: options.order ? options.order : ORDERS[0].key,
      direction: options.direction ? options.direction : DIRECTIONS[0].key,
      searchWord: options.searchWord ? options.searchWord : '',
      organizations: [],
    };
  }

  componentDidMount() {
    const { searchWord, order, direction } = this.state;
    this.getOrganizations(searchWord, order, direction);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      const { searchWord, order, direction } = this.state;
      this.getOrganizations(searchWord, order, direction);
    }
  }

  setOptionToUrl = () => {
    const {
      location: { pathname },
      history,
    } = this.props;

    const { searchWord, order, direction } = this.state;

    const options = {
      order,
      direction,
      searchWord,
    };

    common.setOptions(history, pathname, options);
  };

  getOrganizations = (searchWord, order, direction) => {
    request.get('/api/organizations', { searchWord, order, direction }, (data) => {
      this.setState({
        organizations: data.organizations || [],
      });
    });
  };

  render() {
    const { order, direction, organizations, searchWord } = this.state;
    const { history, t } = this.props;

    return (
      <div className="organization-list-wrapper">
        <SearchBar
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
          onSearch={this.setOptionToUrl}
          onChangeSearchWord={(value) => {
            this.setState({
              searchWord: value,
            });
          }}
          searchPlaceholder={t('label.searchByOrgName')}
          searchWord={searchWord}
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

OrganizationList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
};

export default withRouter(withTranslation()(connect(undefined, undefined)(OrganizationList)));
