import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NoMatch } from '@/pages';
import PrivacyPolicy from '@/pages/About/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from '@/pages/About/TermsAndConditions/TermsAndConditions';

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
