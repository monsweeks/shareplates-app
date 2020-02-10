import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
import scouterApp from './reducers';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-pro/css/all.min.css';
import {HashRouter} from 'react-router-dom'

const store = createStore(scouterApp);

ReactDOM.render(
    <HashRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </HashRouter>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
