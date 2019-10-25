import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, SelectField } from 'react-md';
import './styles.scss';

class Select extends Component {
  state = { searchText: '', value: '' };
  onTextChange = value => {
    this.setState({ searchText: value });
  };

  onVisibilityChange = () => {
    this.setState({ searchText: '' });
  };

  render() {
    const { label, placeholder, menuItems = [], noSearch, searchPlaceholder, onChange, searchFn, ...rest } = this.props;
    const { searchText } = this.state;
    let items = searchText ? searchFn 
      ? menuItems.filter(item => searchFn(item, searchText))
      : menuItems.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()))
      : menuItems;

    if (!noSearch) {
      items = [
        <TextField
          key="search-candidate"
          id="search-candidate"
          className="md-cell md-cell--12"
          placeholder={searchPlaceholder}
          lineDirection="left"
          onChange={this.onTextChange}
        />,
        ...items
      ];
      if (items.length === 1) {
        items = [
          ...items,
          <div key="no-results" className="no-results md-text">
            No Results
          </div>
        ];
      }
    }

    return (
      <SelectField
        id="custom-select"
        label={label}
        placeholder={placeholder}
        className="md-cell md-cell--12"
        listClassName="search-select"
        menuItems={items}
        simplifiedMenu={false}
        onVisibilityChange={this.onVisibilityChange}
        onChange={onChange}
        itemValue="value"
        defaultValue={this.props.defaultValue}
        required
        errorText={`this field is required`}
        {...rest}
      />
    );
  }
}

Select.propTypes = {
  searchFn: PropTypes.func
};

export default Select;
