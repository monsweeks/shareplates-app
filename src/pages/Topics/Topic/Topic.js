import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setConfirm } from 'actions';
import request from '@/utils/request';
import { DetailLayout, PageContent, PageTitle, SubContentBox } from '@/layouts';
import { Col, EmptyMessage, IconViewer, P, Row, SubLabel, SubTitle, UserManager } from '@/components';
import './Topic.scss';

class Topic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      isAdmin: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.isAdmin === null && props.user && state.topic) {
      return {
        isAdmin: state.topic.users.findIndex((u) => u.id === props.user.id) > -1,
      };
    }

    return null;
  }

  componentDidMount() {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;

    this.getTopic(topicId);
  }

  getTopic = (topicId) => {
    request.get(
      `/api/topics/${topicId}`,
      null,
      (topic) => {
        this.setState({
          topic,
        });
      },
      null,
      true,
    );
  };

  deleteTopic = (topicId) => {
    const { history } = this.props;
    request.del(
      `/api/topics/${topicId}`,
      null,
      (data) => {
        history.push(data._links.topics.href);
      },
      null,
      true,
    );
  };

  onDelete = () => {
    const { topic } = this.state;
    const { setConfirm: setConfirmReducer } = this.props;

    setConfirmReducer(`${topic.name} 토픽을 정말 삭제하시겠습니까?`, () => {
      this.deleteTopic(topic.id);
    });
  };

  onList = () => {
    const { history } = this.props;
    history.push('/topics');
  };

  onEdit = () => {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;
    const { history } = this.props;

    history.push(`/topics/${topicId}/edit`);
  };

  render() {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;
    const { t } = this.props;
    const { topic, isAdmin } = this.state;

    return (
      <DetailLayout className="topic-wrapper" margin={false}>
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
        {topic && (
          <>
            <PageTitle
              className=""
              list={[
                {
                  name: t('label.topicList'),
                  to: '/topics',
                },
                {
                  name: topic && topic.name,
                  to: `/topics/${topicId}`,
                },
              ]}
              onDelete={isAdmin ? this.onDelete : null}
              onList={this.onList}
              onEdit={isAdmin ? this.onEdit : null}
              marginBottom={false}
            >
              {t('토픽 정보')}
            </PageTitle>
            <PageContent>
              <Row className="flex-grow-1">
                <Col lg={4} className="d-flex flex-column flex-grow-1 pr-3 pr-lg-2">
                  <SubContentBox className="flex-grow-1">
                    <SubTitle className="flex-grow-0">{t('GENERAL INFO')}</SubTitle>
                    <SubLabel>{t('label.icon')}</SubLabel>
                    <div className="text-center py-4 bg-light mb-3 rounded">
                      <div className="topic-image m-2 m-lg-0">
                        <IconViewer iconIndex={topic.iconIndex} />
                      </div>
                    </div>
                    <SubLabel>{t('label.name')}</SubLabel>
                    <P>{topic.name}</P>
                    <SubLabel>{t('ORG')}</SubLabel>
                    <P upppercase>{topic.organizationName}</P>
                    <SubLabel>{t('label.desc')}</SubLabel>
                    <P pre>{topic.summary}</P>
                    <SubLabel>{t('label.privateTopic')}</SubLabel>
                    <P upppercase>{topic.privateYn ? 'private' : 'public'}</P>
                  </SubContentBox>
                </Col>
                <Col lg={8} className="d-flex flex-column flex-grow-1">
                  <SubContentBox className="flex-grow-1">
                    <SubTitle className="flex-grow-0">{t('label.topicAdmin')}</SubTitle>
                    <UserManager className="mt-3 mt-sm-1" lg={3} md={4} sm={6} xl={12} users={topic.users} blockStyle />
                  </SubContentBox>
                </Col>
              </Row>
            </PageContent>
            <div className="flex-grow-1 d-none">
              <Row className="m-0">
                <Col sm={12} lg={2} className="text-center p-0">
                  <div className="topic-image m-2 m-lg-0">
                    <IconViewer iconIndex={topic.iconIndex} />
                  </div>
                </Col>
                <Col sm={12} lg={10} className="p-0">
                  <SubLabel>{t('label.name')}</SubLabel>
                  <P className="bg-white" upppercase>
                    {topic.name}
                  </P>
                  <SubLabel>{t('ORG')}</SubLabel>
                  <P className="bg-white" upppercase>
                    {topic.organizationName}
                  </P>
                  <SubLabel>{t('label.desc')}</SubLabel>
                  <P className="bg-white" upppercase pre>
                    {topic.summary}
                  </P>
                  <SubLabel>{t('label.privateTopic')}</SubLabel>
                  <P className="bg-white" upppercase>
                    {topic.privateYn ? 'private' : 'public'}
                  </P>
                  <hr className="g-dashed mb-3" />
                  <div className="position-relative mb-3">
                    <SubLabel>{t('label.topicAdmin')}</SubLabel>
                  </div>
                  <div>
                    <UserManager className="mt-3 mt-sm-1" lg={3} md={4} sm={6} xl={12} users={topic.users} />
                  </div>
                </Col>
              </Row>
            </div>
          </>
        )}
      </DetailLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (message, okHandler, noHandle) => dispatch(setConfirm(message, okHandler, noHandle)),
  };
};

export default withRouter(withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Topic)));

Topic.defaultProps = {
  t: null,
};

Topic.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    name: PropTypes.string,
    info: PropTypes.string,
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
  setConfirm: PropTypes.func,
};
