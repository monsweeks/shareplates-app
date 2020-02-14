import {CLEAR_MESSAGE, ADD_MESSAGE, SET_SUPPORTED, SET_USER_DATA, SET_USER_ID,} from '../actions';
import {combineReducers} from 'redux';

const userState = {};

const user = (state = userState, action) => {
    switch (action.type) {
        case SET_USER_ID:
            let currentState = Object.assign({}, state);
            currentState[action.origin] = {
                id: action.id,
                token: action.token,
                time: action.time
            };

            return currentState;

        case SET_USER_DATA:
            return Object.assign({}, state, action.userData);

        default:
            return state;
    }
};


const messageState = {
    messages: []
};

const message = (state = messageState, action) => {
    switch (action.type) {
        case ADD_MESSAGE:
            let messages = state.messages.slice(0);
            messages.push({
                category: action.category,
                title: action.title,
                content: action.content
            });

            return Object.assign({}, state, {messages: messages});

        case CLEAR_MESSAGE:
            return Object.assign({}, {messages: []});

        default:
            return state;
    }
};

const supportedState = {
    supported: true
};

const supported = (state = supportedState, action) => {
    switch (action.type) {

        case SET_SUPPORTED:
            return Object.assign({}, state, {supported: action.supported});
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