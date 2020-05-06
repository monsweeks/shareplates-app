import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoMatch, PrivacyPolicy, TermsAndConditions } from '@/pages';

function About() {
  return (
    <Switch>
      <Route exact path="/about/privacy-policy" component={PrivacyPolicy} />
      <Route exact path="/about/terms-and-conditions" component={TermsAndConditions} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default About;
