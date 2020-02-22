import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Common, NoMatch, Sample } from 'pages';
import { Header } from '@/layouts';
import '@/App.scss';
import About from '@/pages/About';
import Users from '@/pages/Users';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <article className="app-content">
        <Switch>
          <Route path="/users" component={Users} />
          <Route path="/about" component={About} />
          <Route exact path="/sample" component={Sample} />
          <Route component={NoMatch} />
        </Switch>
        <Common />
      </article>
    </div>
  );
}

export default hot(module)(withRouter(App));
