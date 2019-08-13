import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../../pages/Home';
import Application from '../../pages/Application';

class RouteSwitch extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/applications" component={Application} />
        {/* <Route path="/drafts" component={DraftsPage} />
        <Route path="/create" component={CreatePage} />
        <Route path="/post/:id" component={DetailPage} /> */}
      </Switch>
    );
  }
}

export default RouteSwitch;
