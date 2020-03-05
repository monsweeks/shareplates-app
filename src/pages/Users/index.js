import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Join, JoinSuccess, Login, EditMyInfo, NoMatch } from 'pages';


function Users() {
  return (
    <Switch>
      <Route exact path="/users/join" component={Join} />
      <Route exact path="/users/join/success" component={JoinSuccess} />
      <Route exact path="/users/login" component={Login} />
      <Route exact path="/users/my-info/edit" component={EditMyInfo} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default withRouter(Users);
