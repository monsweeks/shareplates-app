import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from "react-router-dom";
import App from './App';
import * as serviceWorker from './serviceWorker';
// import scouterApp from './reducers';
import './scss/custom.scss';
import './scss/fonts.scss';
import './index.scss';
import store from "./store";

// const store = createStore(scouterApp);

ReactDOM.render(
    <Router>
        <Provider store={store}>
            <App/>
        </Provider>
    </Router>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
