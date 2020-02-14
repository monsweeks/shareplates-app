import axios from 'axios';
import store from "store";
import {addMessage} from "actions";
import {ERROR_CATEGORY} from "../constants/constants";
import i18n from "i18next";

const logging = true;

function beforeRequest() {

}

function processSuccess(response, successHandler) {
    logging && console.log(response);
    if (successHandler && typeof (successHandler) === 'function') {
        successHandler(response.data);
    }
}

function processError(error, failHandler) {

    if (error.response) {
        logging && console.log(error.response);
    } else {
        logging && console.log(error);
    }

    if (failHandler && typeof (failHandler) === 'function') {
        failHandler(error, error.response);
    } else if (error && error.response) {
        switch (error.response.status) {
            case 404 : {
                store.dispatch(addMessage(error.response.status, ERROR_CATEGORY.ERROR, '404 NOT FOUND', i18n.t('resourceNotFount')));
                break;
            }
            default : {
                store.dispatch(addMessage(error.response.status, ERROR_CATEGORY.ERROR, '오류', '알 수 없는 오류가 발생했습니다.'));
                break;
            }
        }
    } else {
        store.dispatch(addMessage(500, ERROR_CATEGORY.ERROR, '오류', '알 수 없는 오류가 발생했습니다.'));
    }
}

function afterRequest(response) {

}

function get(uri, params, successHandler, failHandler) {
    beforeRequest();
    axios.get(uri, {
        params,
    }).then(response => {
        processSuccess(response, successHandler);
    }).catch(error => {
        processError(error, failHandler);
    }).finally((response) => {
        afterRequest(response);
    });
}

function post() {

}

function put() {

}

function del() {

}

const request = {
    get,
    post,
    put,
    del,
};

export default request;