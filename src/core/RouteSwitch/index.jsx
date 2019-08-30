import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../../pages/Home';
import Application from '../../pages/Application';
import Candidates from '../../pages/Candidates';
import Steps from '../../pages/Steps';
import TemplateSteps from '../../pages/Template Steps';

class RouteSwitch extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/applications" component={Application} />
        <Route exact path="/candidates" component={Candidates} />
        <Route exact path="/tools/steps" component={Steps} />
        <Route exact path="/tools/template-steps" component={TemplateSteps} />
      </Switch>
    );
  }
}

export default RouteSwitch;
