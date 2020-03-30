export const SET_USER_AND_GRP = 'SET_USER_AND_GRP';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_ALL_MESSAGE';
export const SET_SUPPORTED = 'SET_SUPPORTED';
export const SET_LOADING = 'SET_LOADING';
export const SET_CONFIRM = 'SET_CONFIRM';
export const SET_JOIN_EMAIL = 'SET_JOIN_EMAIL';
export const SET_GRP_ID = 'SET_GRP_ID';

export function setJoinEmail(email) {
  return {
    type: SET_JOIN_EMAIL,
    email,
  };
}

export function setUserAndGrp(user, grps) {
  return {
    type: SET_USER_AND_GRP,
    user,
    grps,
  };
}

export function setGrp(grpId) {
  return {
    type: SET_GRP_ID,
    grpId,
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
  return {
    type: SET_LOADING,
    loading,
  };
}

export function setConfirm(message, okHandler, noHandler) {
  return {
    type: SET_CONFIRM,
    message,
    okHandler,
    noHandler,
  };
}
