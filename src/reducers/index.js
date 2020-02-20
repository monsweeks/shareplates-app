import { combineReducers } from 'redux';
import { CLEAR_MESSAGE, ADD_MESSAGE, SET_SUPPORTED, SET_USER_DATA, SET_USER_ID } from '../actions';

const userState = {
    user: null,
};

const user = (state = userState, action) => {
    const currentState = { ...state };

    switch (action.type) {
        case SET_USER_ID:
            currentState[action.origin] = {
                id: action.id,
                token: action.token,
                time: action.time,
            };

            return currentState;

        case SET_USER_DATA:
            return { ...state, ...action.userData };

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
});

export default reducers;
