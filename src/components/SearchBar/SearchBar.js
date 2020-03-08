import React from 'react';

import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import SearchInput from '@/components/SearchInput/SearchInput';
import RadioButton from '@/components/RadioButton/RadioButton';
import CircleIcon from '@/components/CircleIcon/CircleIcon';
import { Selector } from '@/components';
import './SearchBar.scss';

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

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openOptions: false,
    };
  }

  render() {
    const { openOptions } = this.state;

    const { organizations, organizationId, onChangeOrganization } = this.props;
    const { order, onChangeOrder } = this.props;
    const { direction, onChangeDirection } = this.props;

    return (
      <div className="search-bar-wrapper g-no-select ">
        <div>
          <div className="search-col">
            <SearchInput noBorder color="white" placeholder="토픽명으로 검색" />
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
              <span className="label small">ORG</span>
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
                onChange={onChangeOrganization}
              />
            </div>
            <div className="order-col">
              <span className="label small">정렬</span>
              <RadioButton circle items={orders} value={order} onClick={onChangeOrder} />
              <div className="separator" />
              <RadioButton circle items={directions} value={direction} onClick={onChangeDirection} />
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
    );
  }
}

SearchBar.propTypes = {
  organizationId: PropTypes.number,
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  onChangeOrganization: PropTypes.func,
  order: PropTypes.string,
  direction: PropTypes.string,
  onChangeOrder: PropTypes.func,
  onChangeDirection: PropTypes.func,
};

export default withRouter(withTranslation()(SearchBar));
