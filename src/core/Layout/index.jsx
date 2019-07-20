import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import MainDrawer from '../MainDrawer';
import RouteSwitch from '../RouteSwitch';
import './styles.scss';

class Layout extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <MainDrawer>
            <div className="page-content">
              <RouteSwitch />
            </div>
          </MainDrawer>
        </Fragment>
      </Router>
    );
  }
}

export default Layout;
