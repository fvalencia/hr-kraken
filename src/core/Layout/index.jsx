import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import MainDrawer from '../MainDrawer';
import RouteSwitch from '../RouteSwitch';
import './styles.scss';

class Layout extends Component {
  render() {
    return (
      <Router>
        <MainDrawer>
          <div className="page-content">
            <RouteSwitch />
          </div>
        </MainDrawer>
      </Router>
    );
  }
}

export default Layout;
