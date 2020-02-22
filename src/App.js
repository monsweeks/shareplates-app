import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Common, Join, Login, NoMatch, Sample } from 'pages';
import { Header } from '@/layouts';
import '@/App.scss';
import Info from '@/pages/Info';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <article className="app-content">
        <Switch>
          <Route exact path="/sample" component={Sample} />
          <Route exact path="/join" component={Join} />
          <Route exact path="/login" component={Login} />
          <Route path="/info" component={Info} />
          <Route component={NoMatch} />
        </Switch>
        <Common />
      </article>
    </div>
  );
}

export default hot(module)(withRouter(App));
