import React from 'react';

import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import SearchInput from '@/components/SearchInput/SearchInput';
import RadioButton from '@/components/RadioButton/RadioButton';
import CircleIcon from '@/components/CircleIcon/CircleIcon';
import { Selector } from '@/components';
import './SearchBar.scss';

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
    const { onSearch, onChangeSearchWord, t, searchPlaceholder, searchWord, onClear } = this.props;

    return (
      <div className="search-bar-wrapper g-no-select ">
        <div>
          {onChangeOrganization && (
            <div className="organization-col">
              <span className="label small text-white d-none d-md-inline">{t('label.org')}</span>
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
          )}
          {onChangeSearchWord && (
            <div className="search-col">
              <SearchInput
                noBorder
                color="white"
                placeholder={searchPlaceholder}
                onSearch={onSearch}
                onChange={onChangeSearchWord}
                searchWord={searchWord}
                onClear={onClear}
              />
            </div>
          )}
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
            <div className="order-col">
              <span className="label small">{t('label.order')}</span>
              <RadioButton
                circle
                items={[
                  {
                    key: 'name',
                    value: <i className="fal fa-sort-alpha-up" />,
                    tooltip: t('label.orderByName'),
                  },
                  {
                    key: 'creationDate',
                    value: <i className="fal fa-sort-numeric-up" />,
                    tooltip: t('label.orderByCreationTime'),
                  },
                ]}
                value={order}
                onClick={onChangeOrder}
              />
              <div className="separator" />
              <RadioButton
                circle
                items={[
                  {
                    key: 'asc',
                    value: <i className="fal fa-sort-amount-down" />,
                    tooltip: t('label.orderByAsc'),
                  },
                  {
                    key: 'desc',
                    value: <i className="fal fa-sort-amount-up" />,
                    tooltip: t('label.orderByDesc'),
                  },
                ]}
                value={direction}
                onClick={onChangeDirection}
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
    );
  }
}

SearchBar.propTypes = {
  organizationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
  onSearch: PropTypes.func,
  onChangeSearchWord: PropTypes.func,
  t: PropTypes.func,
  searchPlaceholder : PropTypes.string,
  searchWord : PropTypes.string,
  onClear : PropTypes.func,
};

export default withRouter(withTranslation()(SearchBar));
