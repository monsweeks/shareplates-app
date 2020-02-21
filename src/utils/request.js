import axios from 'axios';
import store from 'store';
import { addMessage } from 'actions';
import i18n from 'i18next';
import ERROR_CATEGORY from '@/constants/constants';

const logging = true;
const base = 'http://localhost:8080';

function beforeRequest() {}

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


    if (!error.status) {
        store.dispatch(
          addMessage(
            900,
            ERROR_CATEGORY.ERROR,
            'NETWORK ERROR',
            i18n.t('message.networkError'),
          ),
        );
    } else if (failHandler && typeof failHandler === 'function') {
        failHandler(error, error.response);
    } else if (error && error.response) {
        switch (error.response.status) {
            case 404: {
                store.dispatch(
                    addMessage(
                        error.response.status,
                        ERROR_CATEGORY.ERROR,
                        '404 NOT FOUND',
                        i18n.t('resourceNotFount'),
                    ),
                );
                break;
            }
            default: {
                store.dispatch(
                    addMessage(error.response.status, ERROR_CATEGORY.ERROR, '오류', '알 수 없는 오류가 발생했습니다.'),
                );
                break;
            }
        }
    } else {
        store.dispatch(addMessage(500, ERROR_CATEGORY.ERROR, '오류', '알 수 없는 오류가 발생했습니다.'));
    }
}

// eslint-disable-next-line no-unused-vars
function afterRequest(response) {}

function get(uri, params, successHandler, failHandler) {
    beforeRequest();
    axios
        .get(`${base}${uri}`, {
            params,
        })
        .then((response) => {
            processSuccess(response, successHandler);
        })
        .catch((error) => {
            processError(error, failHandler);
        })
        .finally((response) => {
            afterRequest(response);
        });
}

function post(uri, params, successHandler, failHandler) {
    beforeRequest();
    axios
        .post(`${base}${uri}`, params)
        .then((response) => {
            processSuccess(response, successHandler);
        })
        .catch((error) => {
            processError(error, failHandler);
        })
        .finally((response) => {
            afterRequest(response);
        });
}

function put() {}

function del() {}

const request = {
    get,
    post,
    put,
    del,
};

export default request;
