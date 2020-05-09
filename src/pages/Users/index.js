import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { EditMyInfo, Join, JoinSuccess, Login, NoMatch, Register } from 'pages';

function Users() {
  return (
    <Switch>
      <Route exact path="/users/register" component={Register} />
      <Route exact path="/users/join" component={Join} />
      <Route exact path="/users/join/success" component={JoinSuccess} />
      <Route exact path="/users/login" component={Login} />
      <Route exact path="/users/my-info/edit" component={EditMyInfo} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default withRouter(Users);
