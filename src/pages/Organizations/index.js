import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { OrganizationList, NewOrganization, NoMatch } from 'pages';

function Organizations() {
  return (
    <Switch>
      <Route exact path="/organizations/new" component={NewOrganization} />
      <Route exact path="/organizations" component={OrganizationList} />

      <Route component={NoMatch} />
    </Switch>
  );
}

export default withRouter(Organizations);
