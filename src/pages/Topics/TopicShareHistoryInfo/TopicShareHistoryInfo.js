import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { DetailLayout } from '@/layouts';
import { EmptyMessage } from '@/components';
import { ShareStat } from '@/assets';
import { DEFAULT_TOPIC_CONTENT } from '@/assets/Topics/PageEditor/PageController/constants';
import { convertUsers } from '@/pages/Users/util';
import './TopicShareHistoryInfo.scss';

class TopicShareHistoryInfo extends Component {
  constructor(props) {
    super(props);

    const {
      match: {
        params: { topicId, shareId },
      },
    } = this.props;

    this.state = {
      topic: null,
      shareId: Number(shareId),
      topicId: Number(topicId),
    };
  }

  componentDidMount() {
    const { topicId } = this.state;
    this.getTopic(topicId);
  }

  getTopic = (topicId) => {
    request.get(
      `/api/topics/${topicId}`,
      null,
      (topic) => {
        const next = { ...topic };
        if (next.content) {
          next.content = { ...JSON.parse(JSON.stringify(DEFAULT_TOPIC_CONTENT)), ...JSON.parse(next.content) };
        } else {
          next.content = JSON.parse(JSON.stringify(DEFAULT_TOPIC_CONTENT));
        }

        next.users = convertUsers(next.users);

        this.setState({
          topic: next,
        });
      },
      null,
      true,
    );
  };

  closePopup = () => {
    this.setState({
      shareId: null,
    });
  };

  render() {
    const { t } = this.props;
    const { topic, shareId } = this.state;

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
            {!topic && topic === false && (
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
            <ShareStat topic={topic} shareId={shareId} setOpen={this.closePopup} />
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

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(TopicShareHistoryInfo)));

TopicShareHistoryInfo.defaultProps = {
  t: null,
};

TopicShareHistoryInfo.propTypes = {
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
      shareId: PropTypes.string,
    }),
  }),
};
