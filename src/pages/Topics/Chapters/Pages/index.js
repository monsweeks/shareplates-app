import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoMatch } from '@/pages';
import PageList from '@/pages/Topics/Chapters/Pages/PageList/PageList';

function Pages() {
  return (
    <Switch>
      <Route exact path="/topics/:topicId/chapters/:chapterId" component={PageList} />
      <Route exact path="/topics/:topicId/chapters/:chapterId/pages" component={PageList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Pages;
