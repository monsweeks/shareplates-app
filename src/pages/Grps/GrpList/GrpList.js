import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FullLayout } from '@/layouts';
import { Col, Row, SearchBar } from '@/components';
import { GrpCard } from '@/assets';
import request from '@/utils/request';
import common from '@/utils/common';
import { DIRECTIONS, ORDERS } from '@/constants/constants';
import './GrpList.scss';

class GrpList extends React.Component {
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
      grps: [],
    };
  }

  componentDidMount() {
    const { options } = this.state;
    this.getGrps(options);
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      location: { search },
    } = this.props;

    const { options } = this.state;

    const pathOptions = common.getOptions(search, ['order', 'direction', 'searchWord']);

    if (location !== prevProps.location) {
      this.getGrps({
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

  getGrps = (options) => {
    const { searchWord, order, direction } = options;
    request.get('/api/groups', { searchWord, order, direction }, (data) => {
      this.setState({
        grps: data.grps || [],
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
      grps,
    } = this.state;

    return (
      <div className="grp-list-wrapper">
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
          searchPlaceholder={t('label.searchByGrpName')}
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
        <FullLayout className="grp-list-content text-center align-self-center">
          <div className="grp-list">
            <Row>
              {grps.map((grp, i) => {
                return (
                  <Col key={i} className="grp-col" xl={3} lg={4} md={6} sm={6}>
                    <GrpCard
                      grp={grp}
                      onCardClick={(grpId) => {
                        history.push(`/groups/${grpId}`);
                      }}
                    />
                  </Col>
                );
              })}
              <Col className="grp-col" xl={3} lg={4} md={6} sm={6}>
                <GrpCard
                  newCard
                  onCardClick={() => {
                    history.push('/groups/new');
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

GrpList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  t: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }),
};

export default withRouter(withTranslation()(connect(undefined, undefined)(GrpList)));
