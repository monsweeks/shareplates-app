import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ShareList, NoMatch, } from 'pages';
import ContentViewer from '@/pages/Shares/ContentViewer/ContentViewer';

function Shares() {
  return (
    <Switch>
      <Route exact path="/shares/:shareId" component={ContentViewer} />
      <Route exact path="/shares" component={ShareList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Shares;
