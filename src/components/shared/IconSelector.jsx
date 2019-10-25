import React from 'react';
import PropTypes from 'prop-types';
import { FontIcon } from 'react-md';

import Select from '../../components/Select';
import icons from '../../constants/materialIcons';

const menuItems = icons.map(icon => ({
  value: icon,
  label: (
    <label>
      <FontIcon>{icon}</FontIcon>
      {icon}
    </label>
  )
}));

const searchFn = (icon, searchText) => {
  return icon.value.toLowerCase().includes(searchText.toLowerCase());
};

const IconSelector = ({ selectedIcon, onChange }) => (
  <Select
    defaultValue={selectedIcon || undefined}
    label="Icon"
    placeholder="Select an Icon"
    searchPlaceholder="Search by Name"
    menuItems={menuItems}
    searchFn={searchFn}
    onChange={onChange}
  />
);

IconSelector.propTypes = {
  selectedIcon: PropTypes.string,
  onChange: PropTypes.func
};

export default IconSelector;
