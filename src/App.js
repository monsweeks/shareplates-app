import React from 'react';
import { hot } from 'react-hot-loader';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Common, NoMatch } from 'pages';
import { EmptyHeader, Footer, Header } from '@/layouts';
import About from '@/pages/About';
import Users from '@/pages/Users';
import Topics from '@/pages/Topics';
import Grps from '@/pages/Grps';
import Shares from '@/pages/Shares';
import Admin from '@/pages/Admin';
import '@/App.scss';

function App() {
  return (
    <div className="app-wrapper">
      <Switch>
        <Route exact path="/shares/:shareId" component={EmptyHeader} />
        <Route component={Header} />
      </Switch>
      <article className="app-content">
        <Switch>
          <Route exact path="/" component={Shares} />
          <Route path="/users" component={Users} />
          <Route path="/about" component={About} />
          <Route path="/topics" component={Topics} />
          <Route path="/groups" component={Grps} />
          <Route path="/shares" component={Shares} />
          <Route path="/admin" component={Admin} />
          <Route component={NoMatch} />
        </Switch>
        <Common />
      </article>
      <Footer />
    </div>
  );
}

export default hot(module)(withRouter(App));
