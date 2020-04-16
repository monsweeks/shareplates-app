import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { OpenShareList, NoMatch, } from 'pages';
import ContentViewer from '@/pages/Shares/ContentViewer/ContentViewer';

function Shares() {
  return (
    <Switch>
      <Route exact path="/shares/:shareId" component={ContentViewer} />
      <Route exact path="/shares" component={OpenShareList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Shares;
