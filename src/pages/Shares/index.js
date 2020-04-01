import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { UnderConstruction, NoMatch, } from 'pages';


function Shares() {
  return (
    <Switch>
      <Route exact path="/shares" component={UnderConstruction} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Shares;
