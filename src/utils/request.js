import axios from 'axios';
import store from 'store';
import { addMessage, setLoading, setUserInfo } from 'actions';
import i18n from 'i18next';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const local = ['localhost', '127.0.0.1', '192.168.39.3'].some((d) => d === window.location.hostname);

const logging = true;
// eslint-disable-next-line no-nested-ternary
let base = local ? (window.location.hostname === '192.168.39.3' ? 'http://192.168.39.3:8080' : 'http://localhost:8080') : '';
base = window.location.port === '3000' ? `http://${window.location.hostname}:8080` : '';

function getBase () {
  return base;
}

function beforeRequest(quiet) {
  if (!quiet) {
    store.dispatch(setLoading(true));
  }
}

function processSuccess(response, successHandler) {
  if (logging) {
    // eslint-disable-next-line no-console
    console.log(response);
  }

  if (successHandler && typeof successHandler === 'function') {
    try {
      successHandler(response.data);
    } catch (e) {
      console.error(e);
      store.dispatch(addMessage(null, MESSAGE_CATEGORY.ERROR, '동작 오류', '스크립트 동작 중 오류가 발생했습니다.'));
    }
  }
}

function processError(error, failHandler) {
  if (logging && error.response) {
    // eslint-disable-next-line no-console
    console.log(error.response);
  } else if (logging && error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  if (!error.response || !error.response.status) {
    store.dispatch(addMessage(900, MESSAGE_CATEGORY.ERROR, 'NETWORK ERROR', i18n.t('message.networkError')));
  } else if (failHandler && typeof failHandler === 'function') {
    failHandler(error, error.response);
  } else if (error && error.response) {
    switch (error.response.status) {
      case 400: {
        if (
          error.response.data &&
          error.response.data &&
          error.response.data.errors &&
          error.response.data.errors.length > 0
        ) {
          store.dispatch(
            addMessage(
              error.response.status,
              MESSAGE_CATEGORY.ERROR,
              '요청이 올바르지 않습니다.',
              `${error.response.data.errors[0].field.toUpperCase()} : ${error.response.data.errors[0].defaultMessage}`,
            ),
          );
        } else {
          store.dispatch(
            addMessage(
              error.response.status,
              MESSAGE_CATEGORY.ERROR,
              '요청이 올바르지 않습니다.',
              error.response && error.response.data && error.response.data.message,
            ),
          );
        }

        break;
      }

      case 401: {

        // 로그인 정보 삭제 및 퍼블릭 그룹만 보이도록 변경
        const { user } = store.getState('user');
        const grps = user.grps ? user.grps.filter((org) => org.publicYn) : [];
        store.dispatch(setUserInfo({}, grps));

        store.dispatch(
          addMessage(
            error.response.status,
            MESSAGE_CATEGORY.ERROR,
            '인증 실패',
            error.response && error.response.data && error.response.data.message,
          ),
        );
        break;
      }

      case 404: {
        store.dispatch(
          addMessage(
            error.response.status,
            MESSAGE_CATEGORY.ERROR,
            '404 NOT FOUND',
            i18n.t('message.resourceNotFount'),
          ),
        );
        break;
      }

      case 409: {
        store.dispatch(
          addMessage(
            error.response.status,
            MESSAGE_CATEGORY.ERROR,
            '요청이 올바르지 않습니다.',
            error.response && error.response.data && error.response.data.message,
          ),
        );
        break;
      }

      default: {
        store.dispatch(
          addMessage(error.response.status, MESSAGE_CATEGORY.ERROR, '오류', error.response && error.response.data && error.response.data.message),
        );
        break;
      }
    }
  } else {
    store.dispatch(addMessage(500, MESSAGE_CATEGORY.ERROR, '오류', '알 수 없는 오류가 발생했습니다.'));
  }
}

function afterRequest(response, quiet) {
  if (!quiet) {
    store.dispatch(setLoading(false));
  }
}

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

function get(uri, params, successHandler, failHandler, quiet) {
  beforeRequest(quiet);
  axios
    .get(`${base}${uri}`, {
      params,
      withCredentials: true,
    })
    .then((response) => {
      processSuccess(response, successHandler);
    })
    .catch((error) => {
      processError(error, failHandler);
    })
    .finally((response) => {
      afterRequest(response, quiet);
    });
}

function post(uri, params, successHandler, failHandler, quiet) {
  beforeRequest(quiet);
  axios
    .post(`${base}${uri}`, params, axiosConfig)
    .then((response) => {
      processSuccess(response, successHandler);
    })
    .catch((error) => {
      processError(error, failHandler);
    })
    .finally((response) => {
      afterRequest(response, quiet);
    });
}

function put(uri, params, successHandler, failHandler, quiet) {
  beforeRequest(quiet);
  axios
    .put(`${base}${uri}`, params, axiosConfig)
    .then((response) => {
      processSuccess(response, successHandler);
    })
    .catch((error) => {
      processError(error, failHandler);
    })
    .finally((response) => {
      afterRequest(response, quiet);
    });
}

function del(uri, params, successHandler, failHandler, quiet) {
  beforeRequest(quiet);
  axios
    .delete(`${base}${uri}`, { ...axiosConfig, ...params })
    .then((response) => {
      processSuccess(response, successHandler);
    })
    .catch((error) => {
      processError(error, failHandler);
    })
    .finally((response) => {
      afterRequest(response, quiet);
    });
}

const request = {
  get,
  post,
  put,
  del,
  getBase,
};

export default request;
