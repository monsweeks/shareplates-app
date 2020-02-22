import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoMatch } from 'pages';
import PrivacyPolicy from '@/pages/Info/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from '@/pages/Info/TermsAndConditions/TermsAndConditions';

function Info() {
  return (
    <Switch>
      <Route exact path="/info/privacy-policy" component={PrivacyPolicy} />
      <Route exact path="/info/terms-and-conditions" component={TermsAndConditions} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default Info;
