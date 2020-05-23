import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Button, SearchInput, Selector } from '@/components';
import { UserManager } from '@/assets';
import request from '@/utils/request';
import './UserSearchPopup.scss';

class UserSearchPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grpId: '',
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
    const { grpId, searchWord } = this.state;
    request.get('/api/users/search', { grpId, condition: searchWord }, (users) => {
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
    const { t, className, grps, setOpen, onApply } = this.props;
    const { markedUsers, markedTag, selectedTitle, selectedUserMarked } = this.props;
    const { grpId, users, selectedUsers, tempSelectedUsers, condition, searchWord } = this.state;

    return (
      <div className={`user-search-popup-wrapper ${className}`}>
        <div className="user-search-row">
          <div className="user-search-col">
            <div className="user-search-content first">
              <div className="search-bar">
                <div className="grp-col">
                  <span className="label small mr-2 d-none d-sm-inline-block">그룹</span>
                  <Selector
                    outline
                    className="grp-selector"
                    items={grps.map((org) => {
                      return {
                        key: org.id,
                        value: org.name,
                      };
                    })}
                    addAll
                    value={grpId}
                    onChange={(id) => {
                      this.setState({
                        grpId: id,
                      });
                    }}
                    minWidth="100px"
                  />
                </div>
                <div className="search-col">
                  <SearchInput
                    color="white"
                    onChange={this.onChangeSearchWord}
                    onSearch={this.search}
                    placeholder={t('사용자 이름 또는 이메일')}
                    searchWord={searchWord}
                    onClear={() => {
                      this.setState(
                        {
                          searchWord: '',
                        },
                        () => {
                          this.search();
                        },
                      );
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
                  markedUsers={selectedUserMarked ? selectedUsers : markedUsers }
                  markedTag={markedTag}
                  emptyContent="검색된 사용자가 없습니다"
                  edit
                  popupContent

                />
              </div>
            </div>
          </div>
          <div className="manager-col d-none d-lg-block">
            <div className="user-search-content">
              {selectedUsers.length > 0 && (
                <div className="title-bar">
                  <div>
                    <span>
                      {selectedTitle} ({selectedUsers.length}명)
                    </span>
                  </div>
                </div>
              )}
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
                  users={selectedUsers}
                  emptyContent="선택된 토픽 관리자가 없습니다"
                  edit
                  singleRow
                />
              </div>
            </div>
          </div>
        </div>
        <div className="popup-buttons">
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
    grps: state.user.grps,
    grpId: state.user.grpId,
  };
};

UserSearchPopup.defaultProps = {
  className: '',
  selectedTitle: '',
  selectedUserMarked : false,
};

UserSearchPopup.propTypes = {
  t: PropTypes.func,
  className: PropTypes.string,
  grps: PropTypes.arrayOf(
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
  selectedTitle: PropTypes.string,
  selectedUserMarked : PropTypes.bool,
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(UserSearchPopup)));
