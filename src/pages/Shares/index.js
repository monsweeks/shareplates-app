import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Share, ShareList, NoMatch, } from 'pages';

function Shares() {
  return (
    <Switch>
      <Route exact path="/shares/:shareId" component={Share} />
      <Route exact path="/shares" component={ShareList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Shares;
