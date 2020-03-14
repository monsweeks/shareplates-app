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

    const options = common.getOptions(search, ['order', 'direction', 'searchWord']);

    this.state = {
      options: {
        order: ORDERS[0].key,
        direction: DIRECTIONS[0].key,
        searchWord: '',
        ...options,
      },
      organizations: [],
    };
  }

  componentDidMount() {
    const { options } = this.state;
    this.getOrganizations(options);
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      location: { search },
    } = this.props;

    const { options } = this.state;

    const pathOptions = common.getOptions(search, ['order', 'direction', 'searchWord']);

    if (location !== prevProps.location) {
      this.getOrganizations({
        ...options,
        ...pathOptions,
      });
    }
  }

  setOptionToUrl = () => {
    const {
      location: { pathname },
      history,
    } = this.props;

    const { options } = this.state;

    common.setOptions(history, pathname, options);
  };

  getOrganizations = (options) => {
    const { searchWord, order, direction } = options;
    request.get('/api/organizations', { searchWord, order, direction }, (data) => {
      this.setState({
        organizations: data.organizations || [],
        options: {
          searchWord,
          order,
          direction,
        },
      });
    });
  };

  render() {
    const { history, t } = this.props;

    const {
      options,
      options: { searchWord, order, direction },
      organizations,
    } = this.state;

    return (
      <div className="organization-list-wrapper">
        <SearchBar
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
