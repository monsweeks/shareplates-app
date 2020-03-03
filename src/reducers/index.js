import { combineReducers } from 'redux';
import {
  ADD_MESSAGE,
  CLEAR_MESSAGE,
  SET_JOIN_EMAIL,
  SET_LOADING,
  SET_ORGANIZATION_ID,
  SET_SUPPORTED,
  SET_USER,
  SET_PAGE_COLOR,
} from '../actions';

const userState = {
  user: null,
  organizationId: null,
  organizations: [],
  join: {
    email: null,
  },
};

const user = (state = userState, action) => {
  const currentState = { ...state };

  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.user, organizations: action.organizations };

    case SET_ORGANIZATION_ID:
      return { ...state, organizationId: action.organizationId };

    case SET_JOIN_EMAIL:
      return Object.assign(currentState, { join: { email: action.email } });

    default:
      return state;
  }
};

const controlState = {
  pageColor: 'white',
};

const control = (state = controlState, action) => {
  switch (action.type) {
    case SET_PAGE_COLOR:
      return { ...state, pageColor: action.pageColor };

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
  control,
});

export default reducers;
