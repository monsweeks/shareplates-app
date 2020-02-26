import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Common, NoMatch, Sample } from 'pages';
import { Header } from '@/layouts';
import About from '@/pages/About';
import Users from '@/pages/Users';
import Topics from '@/pages/Topics';
import '@/App.scss';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <article className="app-content">
        <Switch>
          <Route exact path="/" component={Topics} />
          <Route path="/users" component={Users} />
          <Route path="/about" component={About} />
          <Route path="/samples" component={Sample} />
          <Route path="/topics" component={Topics} />
          <Route component={NoMatch} />
        </Switch>
        <Common />
      </article>
    </div>
  );
}

export default hot(module)(withRouter(App));
