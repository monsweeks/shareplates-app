import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { EditGrp, Grp, GrpList, NewGrp, NoMatch } from 'pages';

function Grps() {
  return (
    <Switch>
      <Route exact path="/groups/new" component={NewGrp} />
      <Route exact path="/groups/:grpId" component={Grp} />
      <Route exact path="/groups/:grpId/edit" component={EditGrp} />
      <Route exact path="/groups" component={GrpList} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default withRouter(Grps);
