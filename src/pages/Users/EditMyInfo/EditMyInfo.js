import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import request from '@/utils/request';
import { addMessage, setUser } from '@/actions';
import { PageTitle, RegisterLayout } from '@/layouts';
import AvatarBuilder from '@/components/AvatarBuilder/AvatarBuilder';
import { Button, Description, Form, FormGroup, Input, P, Selector, SubLabel } from '@/components';
import './EditMyInfo.scss';
import { DATETIME_FORMATS } from '@/constants/constants';
import LANGUAGES from '@/languages/languages';
import RadioButton from '@/components/RadioButton/RadioButton';

const breadcrumbs = [
  {
    name: '내 정보',
    to: '/users/my-info/edit',
  },
  {
    name: '수정',
    to: '/users/my-info',
  },
];

class EditMyInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    this.getMyInfo();
  }

  getMyInfo = () => {
    const { setUser: setUserReducer } = this.props;
    request.get(
      '/api/users/my-info',
      null,
      (data) => {
        const { user } = data;
        if (user && !user.dateTimeFormat) user.dateTimeFormat = DATETIME_FORMATS[0].key;
        if (user && !user.language) user.language = 'ko';

        this.setState({
          user: data.user || {},
        });
      },
      () => {
        setUserReducer({}, []);
      },
    );
  };

  onChange = (field) => (value) => {
    const { user } = this.state;
    const obj = {};
    obj[field] = value;

    this.setState({
      user: { ...user, ...obj },
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { user } = this.state;

    request.put('/api/users/my-info', user, (data) => {
      console.log(data);
    });
  };

  render() {
    const { t } = this.props;
    const { user } = this.state;

    return (
      <RegisterLayout>
        <PageTitle list={breadcrumbs}>{t('내 정보 수정')}</PageTitle>
        <hr className="d-none d-sm-block mb-3" />
        <Form onSubmit={this.onSubmit} className="flex-grow-1 px-2">
          <SubLabel>{t('아이콘')}</SubLabel>
          <Description>{t('SHAREPLATES에서 사용되는 사용자의 아바타 아이콘을 만들 수 있습니다.')}</Description>
          <FormGroup>
            <AvatarBuilder info={user.info} onChange={this.onChange('info')} />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('label.email')}</SubLabel>
          <FormGroup>
            <P value={user.email} />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('label.name')}</SubLabel>
          <FormGroup>
            <Input
              label={t('label.name')}
              value={user.name}
              required
              minLength={2}
              maxLength={100}
              onChange={this.onChange('name')}
              simple
              border
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('날짜 형식')}</SubLabel>
          <FormGroup>
            <Selector
              outline
              items={DATETIME_FORMATS}
              value={user.dateTimeFormat}
              onChange={this.onChange('dateTimeFormat')}
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('언어')}</SubLabel>
          <FormGroup>
            <RadioButton
              items={Object.keys(LANGUAGES)
                .sort()
                .reverse()
                .map((d) => {
                  return {
                    key: d,
                    value: t(d),
                  };
                })}
              value={user.language}
              outline
              onClick={this.onChange('language')}
            />
          </FormGroup>
          <hr className="g-dashed mb-3" />
          <SubLabel>{t('가입일')}</SubLabel>
          <FormGroup>
            <P value={user.creationDate} />
          </FormGroup>
          <FormGroup className="text-center mt-4">
            <Button className="px-4 mx-2" color="secondary">
              {t('button.cancel')}
            </Button>
            <Button className="px-4 mx-2" color="primary">
              {t('button.save')}
            </Button>
          </FormGroup>
        </Form>
      </RegisterLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
    setUser: (user, organizations) => dispatch(setUser(user, organizations)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(EditMyInfo)));

EditMyInfo.propTypes = {
  t: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
