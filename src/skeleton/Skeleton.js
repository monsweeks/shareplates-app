import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { setUserInfo } from '@/actions';
import { UserPropTypes } from '@/proptypes';
import './Skeleton.scss';

class Skeleton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state1: null,
    };
  }

  render() {
    const { t } = this.props;
    const { state1 } = this.state;
    const { user, setUserInfo: setUserInfoAction } = this.props;

    console.log(state1);
    console.log(user, setUserInfoAction);

    return <div className="skeleton-wrapper g-no-select">{t('skeleton')}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (user) => dispatch(setUserInfo(user)),
  };
};

Skeleton.propTypes = {
  user: UserPropTypes,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  setUserInfo: PropTypes.func,
  t: PropTypes.func,
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Skeleton)));
