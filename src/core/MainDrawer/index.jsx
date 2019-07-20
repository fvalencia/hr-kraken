import React, { Component } from 'react';
import { Drawer, NavigationDrawer } from 'react-md';
import { routes as navItemRoutes } from '../../constants/routes.js';
import NavItemLink from '../NavItemLink';
import ActionMenu from '../ActionMenu';
import './styles.scss';

class MainDrawer extends Component {
  state = { position: 'left' };

  render() {
    const { position } = this.state;

    const navItems = navItemRoutes.map(({ divider, subheader, ...props }) => {
      if (divider || subheader) {
        return { divider, subheader, ...props };
      }
      return <NavItemLink {...props} key={props.to} />;
    });

    return (
      <NavigationDrawer
        id="main-drawer"
        type={Drawer.DrawerTypes.PERSISTENT}
        position={position}
        navItems={navItems}
        drawerTitle="HR Kraken"
        className="drawer-container"
        toolbarActions={<ActionMenu />}
      >
        {this.props.children}
      </NavigationDrawer>
    );
  }
}

export default MainDrawer;
