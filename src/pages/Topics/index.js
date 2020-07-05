import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { EditTopic, NewTopic, NoMatch, Topic, TopicList } from 'pages';
import Chapters from '@/pages/Topics/Chapters';

function Topics() {
  return (
    <Switch>
      <Route exact path="/topics/new" component={NewTopic} />
      <Route exact path="/topics/:topicId" component={Topic} />
      <Route exact path="/topics/:topicId/edit" component={EditTopic} />
      <Route exact path="/topics/" component={TopicList} />
      <Route path="/topics/:topicId/chapters" component={Chapters} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Topics;
