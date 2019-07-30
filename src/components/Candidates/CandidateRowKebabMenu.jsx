import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontIcon } from 'react-md';

import ColumnKebabMenu from '../shared/ColumnKebabMenu';

export default class CandidateRowKebabMenu extends Component {
  
  editCandidate = () => {
    console.warn('Not Implemented yet. Edit Candidate ->', this.props.candidate.name);
  }

  deleteCandidate = () => {
    console.warn('Not Implemented yet. Delete Candidate ->', this.props.candidate.name);
  }

  menuItems = [
    {
      leftIcon: <FontIcon>edit</FontIcon>,
      primaryText: 'Edit',
      onClick: this.editCandidate
    },
    {
      leftIcon: <FontIcon>delete_forever</FontIcon>,
      primaryText: 'Delete',
      onClick: this.deleteCandidate
    }
  ];

  render() {
    return <ColumnKebabMenu menuItems={this.menuItems} />;
  }
}

CandidateRowKebabMenu.propTypes = {
  candidate: PropTypes.object.isRequired
};
