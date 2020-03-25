import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, Col, Row, Selector, UserManager } from '@/components';
import './UserSearchPopup.scss';
import SearchInput from '@/components/SearchInput/SearchInput';
import request from '@/utils/request';

class UserSearchPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organizationId: '',
      users: [],
      selectedUsers: [],
      tempSelectedUsers: {},
      condition: '',
      init: false,
      searchWord: '',
    };
  }

  componentDidMount() {
    this.search();
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.init && props.users && props.users.length > 0) {
      const tempSelectedUsers = {};
      props.users.forEach((u) => {
        tempSelectedUsers[u.id] = true;
      });

      return {
        selectedUsers: props.users.slice(0),
        tempSelectedUsers,
        init: true,
      };
    }

    return null;
  }

  search = () => {
    const { organizationId, searchWord } = this.state;
    request.get('/api/users', { organizationId, condition: searchWord }, (users) => {
      this.setState({
        users,
      });
    });
  };

  onChangeSearchWord = (searchWord) => {
    this.setState({
      searchWord,
    });
  };

  render() {
    const { t, className, organizations, setOpen, onApply } = this.props;
    const { markedUsers, markedTag } = this.props;
    const { organizationId, users, selectedUsers, tempSelectedUsers, condition, searchWord } = this.state;

    return (
      <div className={`user-search-popup-wrapper ${className}`}>
        <Row className="user-search-row">
          <Col className="user-search-col" lg={9}>
            <div className="user-search-content first">
              <div className="search-bar">
                <div className="organization-col">
                  <span className="label small mr-2 d-none d-sm-inline-block">ORG</span>
                  <Selector
                    className="organization-selector"
                    items={organizations.map((org) => {
                      return {
                        key: org.id,
                        value: org.name,
                      };
                    })}
                    addAll
                    value={organizationId}
                    onChange={(id) => {
                      this.setState({
                        organizationId: id,
                      });
                    }}
                  />
                </div>
                <div className="search-col">
                  <SearchInput
                    onChange={this.onChangeSearchWord}
                    onSearch={this.search}
                    placeholder={t('사용자 이름 또는 이메일')}
                    searchWord={searchWord}
                    onClear={() => {
                      this.setState({
                        searchWord : '',
                      }, () => {
                        this.search();
                      });
                    }}
                  />
                </div>
                <div className="button-col">
                  <Button
                    color="primary"
                    size="sm"
                    className="px-3"
                    onClick={() => {
                      this.search(condition);
                    }}
                  >
                    검색
                  </Button>
                </div>
              </div>
              <div className="user-search-result scrollbar">
                <UserManager
                  onClick={(id) => {
                    const temp = { ...tempSelectedUsers };
                    const selected = selectedUsers.slice(0);
                    if (temp[id]) {
                      delete temp[id];
                      const index = selected.findIndex((u) => u.id === id);
                      selected.splice(index, 1);
                    } else {
                      temp[id] = true;
                      if (!selected.find((u) => u.id === id)) {
                        selected.push(users.find((u) => u.id === id));
                      }
                    }

                    this.setState({
                      tempSelectedUsers: temp,
                      selectedUsers: selected,
                    });
                  }}
                  hover
                  users={users}
                  selectedUsers={tempSelectedUsers}
                  markedUsers={markedUsers}
                  markedTag={markedTag}
                  emptyContent="검색된 사용자가 없습니다"
                  edit
                />
              </div>
            </div>
          </Col>
          <Col className="user-search-col d-none d-lg-block" lg={3}>
            <div className="user-search-content">
              <div className="title-bar">
                <div>
                  <span>추가된 사용자</span>
                </div>
              </div>
              <div className="user-select-result scrollbar ">
                <UserManager
                  onRemove={(id) => {
                    const selected = selectedUsers.slice(0);
                    const index = selected.findIndex((u) => u.id === id);
                    selected.splice(index, 1);

                    const temp = { ...tempSelectedUsers };
                    if (temp[id]) {
                      delete temp[id];
                    }

                    this.setState({
                      tempSelectedUsers: temp,
                      selectedUsers: selected,
                    });
                  }}
                  lg={12}
                  md={12}
                  sm={12}
                  users={selectedUsers}
                  emptyContent="검색된 사용자가 없습니다"
                  edit
                />
              </div>
            </div>
          </Col>
        </Row>
        <div className="popup-buttons p-3">
          <Button
            className="px-4 mr-2"
            color="secondary"
            onClick={() => {
              setOpen(false);
            }}
          >
            {t('취소')}
          </Button>
          <Button
            className="px-4"
            color="primary"
            onClick={() => {
              if (onApply) {
                onApply(selectedUsers);
              }
              setOpen(false);
            }}
          >
            {t('선택')}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    organizations: state.user.organizations,
    organizationId: state.user.organizationId,
  };
};

UserSearchPopup.defaultProps = {
  className: '',
};

UserSearchPopup.propTypes = {
  t: PropTypes.func,
  className: PropTypes.string,
  organizations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      publicYn: PropTypes.bool,
    }),
  ),
  users: PropTypes.arrayOf(PropTypes.any),
  setOpen: PropTypes.func,
  onApply: PropTypes.func,
  markedUsers: PropTypes.arrayOf(PropTypes.any),
  markedTag: PropTypes.string,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(UserSearchPopup)));
