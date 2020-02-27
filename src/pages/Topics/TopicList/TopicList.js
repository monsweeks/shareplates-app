import React from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { DetailLayout } from '@/layouts';
import SearchInput from '@/components/SearchInput/SearchInput';
import RadioButton from '@/components/RadioButton/RadioButton';
import { setUser } from '@/actions';
import { Selector } from '@/components';
import './TopicList.scss';

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

  render() {
    const { order, direction, organizationId } = this.state;
    // eslint-disable-next-line no-unused-vars
    const { organizations, setUser: setUserReducer } = this.props;

    return (
      <div className="topic-list-wrapper">
        <div className="g-no-select search-bar">
          <div>
            <div className="search-col">
              <SearchInput placeholder='토픽명으로 검색' />
            </div>
            <div className="organization-col">
              <span className="label small">ORG</span>
              <Selector
                className='organization-selector'
                items={organizations.map((org) => {
                  return {
                    key: org.id,
                    value: org.name,
                  };
                })}
                value={organizationId}
                onChange={(id) => {
                  this.setState({
                    organizationId : id
                  });
                }}
              />
            </div>
            <div className="order-col">
              <span className="label small">정렬</span>
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
        </div>
        <DetailLayout className="topic-list-content text-center align-self-center">
          <div className="topic-list">&nbsp;</div>
        </DetailLayout>
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
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TopicList)));
