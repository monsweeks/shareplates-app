import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { addMessage, setJoinEmail } from 'actions';
import { RegisterLayout } from '@/layouts';
import { Button, Col, Form, FormGroup, IconSelector, Input, Row, TextArea } from '@/components';
import request from '@/utils/request';

import './NewTopic.scss';
import { MESSAGE_CATEGORY } from '@/constants/constants';

class NewTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: Map({
        name: '',
        summary: '',
        organizationId: '',
        iconIndex : null,
      }),
      existName : false,
    };

    this.checkNameExistDebounced = debounce(this.checkNameExist, 400);
  }

  componentWillUnmount() {
    this.checkNameExistDebounced.cancel();
  }


  checkNameExist = (email) => {
    request.get(
      '/api/users/exists',
      { email },
      (data) => {
        this.setState({
          existName: data,
        });
      },
      null,
      true,
    );
  };


  onChange = (field) => (value) => {
    const { topic } = this.state;

    console.log(field, value);

    if (field === 'email') {
      this.checkNameExistDebounced(value);
    }
    this.setState({
      topic: topic.set(field, value),
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const { topic } = this.state;
    const { t, history, addMessage: addMessageReducer } = this.props;

    if (topic.get('passwordConfirm') !== topic.get('password')) {
      addMessageReducer(0, MESSAGE_CATEGORY.INFO, t('validation.badInput'), t('validation.notEqualPassword'));
      return;
    }

    request.post('/api/topics', topic.toJS(), (data) => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.setJoinEmail(data.email);
      history.push('/topics/join/success');
    });
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const { t, addMessage: addMessageReducer } = this.props;
    const { topic, existName  } = this.state;

    console.log(existName);

    return (
      <RegisterLayout className="new-topic-wrapper align-self-center">
        <h1 className="text-center">{t('새로운 토픽 만들기')}</h1>
        <Row className="mb-4">
          <Col>
            <Form onSubmit={this.onSubmit} className="px-2 px-sm-0">
              <FormGroup>
                <IconSelector iconIndex={topic.get('iconIndex')} onChange={this.onChange('iconIndex')} />
              </FormGroup>
              <FormGroup>
                <Input
                  label={t('label.name')}
                  value={topic.get('name')}
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('name')}
                />

              </FormGroup>
              <FormGroup>
                <TextArea label={t('설명')} placeholderMessage='새로운 토픽에 대한 설명을 입력해주세요' value={topic.get('summary')} onChange={this.onChange('summary')}/>
              </FormGroup>
              <FormGroup>
                <Input
                  label={t('label.passwordConfirm')}
                  value={topic.get('passwordConfirm')}
                  type="password"
                  required
                  minLength={2}
                  maxLength={100}
                  onChange={this.onChange('passwordConfirm')}
                />
              </FormGroup>
              <FormGroup className="text-center">
                <Button className="px-4" color="primary">
                  {t('label.join')}
                </Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </RegisterLayout>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setJoinEmail: (email) => dispatch(setJoinEmail(email)),
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(NewTopic)));

NewTopic.defaultProps = {
  t: null,
};

NewTopic.propTypes = {
  t: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any),
  setJoinEmail: PropTypes.func,
  addMessage: PropTypes.func,
};
