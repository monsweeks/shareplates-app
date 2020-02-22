import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Join, JoinSuccess, Login, NoMatch } from 'pages';

function Users() {
  return (
    <Switch>
      <Route exact path="/users/join" component={Join} />
      <Route exact path="/users/join/success" component={JoinSuccess} />
      <Route exact path="/users/login" component={Login} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Users;
