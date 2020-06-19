import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { AdminMenu, AdminNoMatch, UserList, User } from 'pages';
import './index.scss';

function Admin() {
  return (
    <div className="admin-wrapper">
      <div>
        <div className="admin-menu">
          <AdminMenu />
        </div>
        <div className="admin-content">
          <div>
            <Switch>
              <Route exact path="/admin/users/:userId" component={User} />
              <Route exact path="/admin/users" component={UserList} />
              <Route component={AdminNoMatch} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Admin);
