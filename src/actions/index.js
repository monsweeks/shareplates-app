export const SET_USER = 'SET_USER';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_ALL_MESSAGE';
export const SET_SUPPORTED = 'SET_SUPPORTED';
export const SET_LOADING = 'SET_LOADING';
export const SET_JOIN_EMAIL = 'SET_JOIN_EMAIL';
export const SET_ORGANIZATION_ID = 'SET_ORGANIZATION_ID';
export const SET_PAGE_COLOR = 'SET_PAGE_COLOR';

export function setJoinEmail(email) {
  return {
    type: SET_JOIN_EMAIL,
    email,
  };
}

export function setUser(user, organizations) {
  return {
    type: SET_USER,
    user,
    organizations,
  };
}

export function setOrganization(user, organizationId) {
  return {
    type: SET_ORGANIZATION_ID,
    organizationId,
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

export function setPageColor(pageColor) {
  return {
    type: SET_PAGE_COLOR,
    pageColor,
  };
}
