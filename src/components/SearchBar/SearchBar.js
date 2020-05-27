import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { CircleIcon, RadioButton, SearchInput, Selector } from '@/components';
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
    const { className, grps, grpId, onChangeGrp } = this.props;
    const { order, onChangeOrder } = this.props;
    const { direction, onChangeDirection } = this.props;
    const { onSearch, onChangeSearchWord, t, searchPlaceholder, searchWord, onClear } = this.props;

    return (
      <div className={`search-bar-wrapper g-no-select ${className}`}>
        <div>
          {onChangeGrp && (
            <div className="grp-col">
              <span className="label small text-white d-none d-md-inline">{t('label.org')}</span>
              <Selector
                outline
                className="grp-selector"
                items={grps.map((org) => {
                  return {
                    key: org.id,
                    value: org.name,
                  };
                })}
                value={grpId}
                onChange={onChangeGrp}
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

SearchBar.defaultProps = {
  className: '',
};

SearchBar.propTypes = {
  className: PropTypes.string,
  grpId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  grps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  onChangeGrp: PropTypes.func,
  order: PropTypes.string,
  direction: PropTypes.string,
  onChangeOrder: PropTypes.func,
  onChangeDirection: PropTypes.func,
  onSearch: PropTypes.func,
  onChangeSearchWord: PropTypes.func,
  t: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  searchWord: PropTypes.string,
  onClear: PropTypes.func,
};

export default withRouter(withTranslation()(SearchBar));
