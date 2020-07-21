import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { DetailLayout } from '@/layouts';
import { EmptyMessage } from '@/components';
import { ShareHistoryList } from '@/assets';
import './TopicShareHistoryList.scss';

class TopicShareHistoryList extends Component {
  constructor(props) {
    super(props);

    const {
      match: {
        params: { topicId },
      },
    } = this.props;

    this.state = {
      topic: null,
      shares: null,
      isAdmin: null,
      topicId: Number(topicId),
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isAdmin === null && props.user && state.topic) {
      return {
        isAdmin: state.topic.users.findIndex((u) => u.id === props.user.id) > -1 || props.user.isAdmin,
      };
    }

    return null;
  }

  componentDidMount() {
    const { topicId } = this.state;

    this.getShares(topicId);
  }

  getShares = (topicId) => {
    request.get(`/api/topics/${topicId}/shares`, null, (data) => {
      this.setState({
        shares: data.shares,
      });
    });
  };

  onList = () => {
    const { history } = this.props;
    history.push('/topics');
  };

  render() {
    const { t } = this.props;
    const { shares } = this.state;

    return (
      <div className="topic-wrapper">
        <div className="topic-menu">
          <div
            className="menu-item"
            onClick={() => {
              const { history } = this.props;
              const { topicId } = this.state;
              history.push(`/topics/${topicId}`);
            }}
          >
            <div>토픽 정보</div>
          </div>
          <div className="separator">
            <div />
          </div>
          <div
            className="menu-item selected"
            onClick={() => {
              const { history } = this.props;
              const { topicId } = this.state;
              history.push(`/topics/${topicId}/shares`);
            }}
          >
            <div>공유 이력</div>
          </div>
          <div className="separator">
            <div />
          </div>
          <div
            className="menu-item"
            onClick={() => {
              const { history } = this.props;
              const { topicId } = this.state;
              history.push(`/topics/${topicId}/chapters`);
            }}
          >
            <div>컨텐츠</div>
          </div>
        </div>
        <div className="topic-content">
          <DetailLayout className="m-0 h-100">
            {!shares && shares === false && (
              <EmptyMessage
                className="h5 bg-white"
                message={
                  <div>
                    <div className="h1">
                      <i className="fal fa-exclamation-circle" />
                    </div>
                    <div>{t('message.notFoundResource')}</div>
                  </div>
                }
              />
            )}
            {shares && (
              <ShareHistoryList
                shares={shares}
                onList={this.onList}
                onClick={(id) => {
                  const { history } = this.props;
                  const { topicId } = this.state;
                  history.push(`/topics/${topicId}/shares/${id}`);
                }}
              />
            )}
          </DetailLayout>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(TopicShareHistoryList)));

TopicShareHistoryList.defaultProps = {
  t: null,
};

TopicShareHistoryList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    isAdmin: PropTypes.bool,
  }),
  t: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string,
    }),
  }),
};
