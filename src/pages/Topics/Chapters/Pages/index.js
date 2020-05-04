import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoMatch, Page } from '@/pages';

function Pages() {
  return (
    <Switch>
      <Route exact path="/topics/:topicId/chapters/:chapterId" component={Page} />
      <Route exact path="/topics/:topicId/chapters/:chapterId/pages" component={Page} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Pages;
