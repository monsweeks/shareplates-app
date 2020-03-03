import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoMatch } from 'pages';
import StatusSample from '@/pages/Sample/StatusSample/StatusSample';

function Users() {
  return (
    <Switch>
      <Route exact path="/samples/status" component={StatusSample} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Users;
