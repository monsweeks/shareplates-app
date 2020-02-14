export const SET_USER_ID = 'SET_USER_ID';
export const SET_USER_DATA = 'SET_USER_DATA';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_ALL_MESSAGE';
export const SET_SUPPORTED = 'SET_SUPPORTED';

export function setUserId(origin, id, token, time) {
    return {
        type: SET_USER_ID,
        origin: origin,
        id: id,
        token: token,
        time: time
    };
}

export function setUserData(userData) {
    return {
        type: SET_USER_DATA,
        userData: userData
    };
}


export function addMessage(code, category, title, content) {
    return {
        type: ADD_MESSAGE,
        code : code,
        category: category,
        title: title,
        content: content
    };
}

export function clearMessage() {
    return {
        type: CLEAR_MESSAGE
    };
}

export function setSupported(value) {
    return {
        type: SET_SUPPORTED,
        supported: value
    };
}
