import axios from 'axios';
import store from 'store';
import { addMessage, setLoading } from 'actions';
import i18n from 'i18next';
import { MESSAGE_CATEGORY } from '@/constants/constants';

const local = ['localhost', '127.0.0.1'].some((d) => d === window.location.hostname);
const logging = true;
const base = local ? 'http://localhost:8080' : '';

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
    successHandler(response.data);
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
      default: {
        store.dispatch(
          addMessage(error.response.status, MESSAGE_CATEGORY.ERROR, '오류', '알 수 없는 오류가 발생했습니다.'),
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

function put() {}

function del(uri, params, successHandler, failHandler, quiet) {
  beforeRequest(quiet);
  axios
    .delete(`${base}${uri}`, { ...axiosConfig, ...params})
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
};

export default request;
