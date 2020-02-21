export const SET_USER_ID = 'SET_USER_ID';
export const SET_USER_DATA = 'SET_USER_DATA';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_ALL_MESSAGE';
export const SET_SUPPORTED = 'SET_SUPPORTED';
export const SET_LOADING = 'SET_LOADING';

export function setUserId(origin, id, token, time) {
    return {
        type: SET_USER_ID,
        origin,
        id,
        token,
        time,
    };
}

export function setUserData(userData) {
    return {
        type: SET_USER_DATA,
        userData,
    };
}

export function addMessage(code, category, title, content) {
    return {
        type: ADD_MESSAGE,
        code,
        category,
        title,
        content,
    };
}

export function clearMessage() {
    return {
        type: CLEAR_MESSAGE,
    };
}

export function setSupported(value) {
    return {
        type: SET_SUPPORTED,
        supported: value,
    };
}

export function setLoading(loading) {
    console.log('setLoading', loading);
    return {
        type: SET_LOADING,
        loading,
    };
}
