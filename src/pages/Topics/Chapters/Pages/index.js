import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoMatch } from '@/pages';
import PageManager from '@/pages/Topics/Chapters/Pages/PageManager/PageManager';

function Pages() {
  return (
    <Switch>
      <Route exact path="/topics/:topicId/chapters/:chapterId" component={PageManager} />
      <Route exact path="/topics/:topicId/chapters/:chapterId/pages" component={PageManager} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Pages;
