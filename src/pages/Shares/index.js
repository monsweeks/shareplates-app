import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { OpenShareList, NoMatch, } from 'pages';


function Shares() {
  return (
    <Switch>
      <Route exact path="/shares" component={OpenShareList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Shares;
