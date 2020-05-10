import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ChapterList, NoMatch } from '@/pages';
import Pages from '@/pages/Topics/Chapters/Pages';

function Chapters() {
  return (
    <Switch>
      <Route path="/topics/:topicId/chapters/:chapterId" component={Pages} />
      <Route exact path="/topics/:topicId/chapters" component={ChapterList} />
      <Route exact path="/topics/:topicId" component={ChapterList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Chapters;
