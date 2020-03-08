import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import request from '@/utils/request';
import { DetailLayout, PageTitle } from '@/layouts';
import { BottomButton, Col, IconViewer, P, Row, SubLabel, UserManager } from '@/components';
import './Topic.scss';

class Topic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: null,
      users: [],
    };
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
      (data) => {
        this.setState({
          topic: data.topic,
          users: data.topicUsers,
        });
      },
      null,
      true,
    );
  };

  render() {
    const {
      match: {
        params: { topicId },
      },
    } = this.props;
    const { t, history } = this.props;
    const { topic, users } = this.state;

    return (
      <DetailLayout className="topic-wrapper">
        {topic && (
          <>
            <PageTitle
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
            >
              {topic.name}
            </PageTitle>
            <hr className="d-none d-sm-block mb-3" />
            <div className="flex-grow-1">
              <Row className="m-0">
                <Col sm={12} lg={2} className="text-center p-0">
                  <div className="topic-image m-2">
                    <IconViewer iconIndex={topic.iconIndex} />
                  </div>
                </Col>
                <Col sm={12} lg={10} className="p-0">
                  <SubLabel>{t('label.name')}</SubLabel>
                  <P className="bg-white" upppercase value={topic.name} />
                  <hr className="g-dashed mb-3" />
                  <SubLabel>{t('ORGANIZATION')}</SubLabel>
                  <P className="bg-white" upppercase value={topic.organization.name} />
                </Col>
                <Col xs={12} className="p-0">
                  <hr className="g-dashed mb-3" />
                  <SubLabel>{t('label.desc')}</SubLabel>
                  <P className="bg-white" upppercase pre value={topic.summary} />
                  <hr className="g-dashed mb-3" />
                  <SubLabel>{t('label.privateTopic')}</SubLabel>
                  <P className="bg-white" upppercase value={topic.privateYn ? 'private' : 'public'} />
                  <hr className="g-dashed mb-3" />
                  <div className="position-relative">
                    <SubLabel>{t('label.topicAdmin')}</SubLabel>
                  </div>
                  <div>
                    <UserManager
                      emptyBackgroundColor="#F6F6F6"
                      className="selected-user mt-3 mt-sm-1"
                      lg={3}
                      md={4}
                      sm={6}
                      xl={12}
                      users={users}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <BottomButton
              onDelete={() => {
                console.log(topic.id);
              }}
              onList={() => {
                history.push('/topics');
              }}
              onEdit={() => {
                history.push(`/topics/${topicId}/edit`);
              }}
            />
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

export default withRouter(withTranslation()(connect(mapStateToProps, undefined)(Topic)));

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
};
