import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AccessCode, NoMatch, Share, ShareList } from 'pages';

function Shares() {
  return (
    <Switch>
      <Route exact path="/" component={ShareList} />
      <Route exact path="/shares/:shareId/code" component={AccessCode} />
      <Route exact path="/shares/:shareId" component={Share} />
      <Route exact path="/shares" component={ShareList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Shares;
