import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'components';
import request from 'utils/request';
import { addMessage } from 'actions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class Sample extends React.PureComponent {
  render() {
    const { t, i18n } = this.props;

    return (
      <div>
        <h2>서버 요청에 대한 샘플</h2>
        <div>
          <Button
            className="mr-4"
            onClick={() => {
              request.get('/api/organizations', null, (data) => {
                // eslint-disable-next-line no-console
                console.log(data);
              });
            }}
          >
            GET ORG LIST
          </Button>
          <Button
            className="mr-4"
            onClick={() => {
              request.get('http://localhost:8080/api/noexist', null, (data) => {
                // eslint-disable-next-line no-console
                console.log(data);
              });
            }}
          >
            404 에러 테스트
          </Button>
          <Button
            className="mr-4"
            onClick={() => {
              request.get(
                'http://localhost:8080/api/noexist',
                null,
                (data) => {
                  // eslint-disable-next-line no-console
                  console.log(data);
                },
                (error, response) => {
                  // eslint-disable-next-line no-console
                  console.log(error);
                  // eslint-disable-next-line no-console
                  console.log(response);
                },
              );
            }}
          >
            404 에러 테스트 (에러 개별 처리)
          </Button>
        </div>
        <h2>다국어 테스트</h2>
        <div>
          <div>{t('sample.hello')}</div>
          <div>{t('sample.selected', { n: 5 })}</div>
          <Button
            onClick={() => {
              i18n.changeLanguage('en-US');
            }}
          >
            English
          </Button>
          <Button
            onClick={() => {
              i18n.changeLanguage('ko-KR');
            }}
          >
            Korean
          </Button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (code, category, title, content) => dispatch(addMessage(code, category, title, content)),
  };
};

export default withRouter(withTranslation()(connect(undefined, mapDispatchToProps)(Sample)));

Sample.propTypes = {
  i18n: PropTypes.objectOf(PropTypes.any),
  t: PropTypes.func,
};
