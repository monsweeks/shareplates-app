import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NewTopic, NoMatch, TopicList } from 'pages';
import Chapters from '@/pages/Topics/Chapters';

function Topics() {
  return (
    <Switch>
      <Route exact path="/" component={TopicList} />
      <Route exact path="/topics/new" component={NewTopic} />
      <Route exact path="/topics/" component={TopicList} />
      <Route path="/topics/:topicId" component={Chapters} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Topics;
