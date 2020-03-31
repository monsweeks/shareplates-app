import { combineReducers } from 'redux';
import {
  ADD_MESSAGE,
  CLEAR_MESSAGE,
  SET_JOIN_EMAIL,
  SET_LOADING,
  SET_GRP_ID,
  SET_SUPPORTED,
  SET_USER_AND_GRP,
  SET_CONFIRM,
} from '../actions';

const userState = {
  user: null,
  grpId: null,
  grps: [],
  join: {
    email: null,
  },
};

const user = (state = userState, action) => {
  const currentState = { ...state };

  switch (action.type) {
    case SET_USER_AND_GRP:
      return { ...state, user: action.user, grps: action.grps };

    case SET_GRP_ID:
      return { ...state, grpId: action.grpId };

    case SET_JOIN_EMAIL:
      return Object.assign(currentState, { join: { email: action.email } });

    default:
      return state;
  }
};

const messageState = {
  messages: [],
};

const message = (state = messageState, action) => {
  const messages = state.messages.slice(0);
  switch (action.type) {
    case ADD_MESSAGE:
      messages.push({
        category: action.category,
        title: action.title,
        content: action.content,
      });

      return { ...state, messages };

    case CLEAR_MESSAGE:
      return { messages: [] };

    default:
      return state;
  }
};

const loadingState = {
  loading: false,
};

const loading = (state = loadingState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.loading };
    default:
      return state;
  }
};

const confirmState = {
  message: null,
  okHandler: null,
  noHandler: null,
};

const confirm = (state = confirmState, action) => {
  switch (action.type) {
    case SET_CONFIRM:
      return { ...state, message: action.message, okHandler: action.okHandler, noHandler: action.noHandler };
    default:
      return state;
  }
};

const supportedState = {
  supported: true,
};

const supported = (state = supportedState, action) => {
  switch (action.type) {
    case SET_SUPPORTED:
      return { ...state, supported: action.supported };
    default:
      return state;
  }
};

const reducers = combineReducers({
  supported,
  user,
  message,
  loading,
  confirm,
});

export default reducers;
