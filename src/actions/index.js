export const SET_USER_AND_GRP = 'SET_USER_AND_GRP';
export const SET_MESSAGE = 'SET_MESSAGE';
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

export function setUserInfo(user, grps, shareCount) {
  return {
    type: SET_USER_AND_GRP,
    user,
    grps,
    shareCount,
  };
}

export function setGrp(grpId) {
  return {
    type: SET_GRP_ID,
    grpId,
  };
}

export function setMessage(category, title, content, okHandler) {
  return {
    type: SET_MESSAGE,
    category,
    title,
    content,
    okHandler,
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

export function setConfirm(category, title, content, okHandler, noHandler) {
  return {
    type: SET_CONFIRM,
    category,
    title,
    content,
    okHandler,
    noHandler,
  };
}
