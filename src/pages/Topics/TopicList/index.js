import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoMatch, TopicList } from 'pages';

function Topics() {
  return (
    <Switch>
      <Route exact path="/" component={TopicList} />
      <Route exact path="/topics/" component={TopicList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Topics;