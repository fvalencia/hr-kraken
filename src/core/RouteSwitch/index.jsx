import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../../pages/Home';
import Opening from '../../pages/Opening/Opening';

class RouteSwitch extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/openings" component={Opening} />
        {/* <Route path="/drafts" component={DraftsPage} />
        <Route path="/create" component={CreatePage} />
        <Route path="/post/:id" component={DetailPage} /> */}
      </Switch>
    );
  }
}

export default RouteSwitch;
