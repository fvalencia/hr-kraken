import React from 'react';
import { MenuButtonColumn, FontIcon } from 'react-md';

const ColumnKebabMenu = props => (
  <MenuButtonColumn
    {...props}
    icon
  >
    <FontIcon>more_vert</FontIcon>
  </MenuButtonColumn>
);

export default ColumnKebabMenu;
