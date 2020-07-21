import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import App from 'App';
import * as serviceWorker from 'serviceWorker';
// import * as Sentry from '@sentry/react';
import store from './store';
import '@/languages/i18n';
import '@fortawesome/fontawesome-pro/css/all.min.css';
import './index.scss';

// Sentry.init({dsn: 'https://9b4fc2c4c76d44e8b8a513a3d0450fbf@o417693.ingest.sentry.io/5318846'});

JavascriptTimeAgo.locale(en);

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
