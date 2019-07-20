import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontIcon, ListItem } from 'react-md';

/**
 * This on creates the route link in the ListItem to be able to click the item in the nav and 
 * navigate to another route, if routes is present it would do a recursive link creation and return
 * the respective list item and so on, and if the it has route we don't sent a component to the ListItem
 * so the element would work as a div instead of a link to a different route.
 */
const NavItemLink = ({ label, to, icon, exact, routes }) => (
  <Route path={to} exact={exact}>
    {({ match }) => {
      let leftIcon;
      let nestedItems;
      const component = to && !routes ? Link : undefined;
      if (icon) {
        leftIcon = <FontIcon>{icon}</FontIcon>;
      }

      if (routes) {
        nestedItems = routes.map(route => <NavItemLink {...route} key={route.to || route.label} />);
      }

      return (
        <ListItem
          component={component}
          active={!!match}
          to={to}
          primaryText={label}
          leftIcon={leftIcon}
          nestedItems={nestedItems}
          defaultVisible={routes && !!match}
        />
      );
    }}
  </Route>
);

NavItemLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string,
  exact: PropTypes.bool,
  icon: PropTypes.node,
  href: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object)
};

export default NavItemLink;
