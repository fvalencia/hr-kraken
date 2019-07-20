import React, { Component } from 'react';
import { Avatar, FontIcon, AccessibleFakeButton, IconSeparator, DropdownMenu } from 'react-md';

class ActionMenu extends Component {
  render() {
    // TODO: Figure out how to do routing here.
    const menu = ['Preferences', 'About', { divider: true }, 'Log out'];

    return (
      <DropdownMenu
        id="avatar-dropdown-menu"
        menuItems={menu}
        anchor={{
          x: DropdownMenu.HorizontalAnchors.CENTER,
          y: DropdownMenu.VerticalAnchors.BOTTOM
        }}
        position={DropdownMenu.Positions.BELOW}
        animationPosition="below"
        sameWidth
      >
        <AccessibleFakeButton
          component={IconSeparator}
          label={
            <IconSeparator label="Mr Doggy">
              <FontIcon>arrow_drop_down</FontIcon>
            </IconSeparator>
          }
        >
          <Avatar src="./dogo.png" />
        </AccessibleFakeButton>
      </DropdownMenu>
    );
  }
}

export default ActionMenu;
