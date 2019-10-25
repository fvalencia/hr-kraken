import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import { FontIcon } from 'react-md';

import EntityTable from '../shared/EntityTable';

export default class ApplicationsTable extends Component {
  columns = [
    { title: 'Start Date', propertyName: 'startDateOverview'},
    { title: 'End Date', propertyName: 'endDateOverview'},
    { title: 'Responsible', propertyName: 'responsible'},
    { title: 'Candidate', propertyName: 'candidateOverview'},
    { title: 'Opening', propertyName: 'openingOverview'},
    { title: 'Result', propertyName: 'result'},
  ];

  onClickEdit = application => {
    return () => {
      this.props.assesFn(application);
    }
  };

  isAssessMenuItemDisable = (application) => {
    return !!application.endDate;
  }

  menuItems = [
    {
      key: 'assess',
      leftIcon: <FontIcon>how_to_reg</FontIcon>,
      primaryText: 'Assess',
      onClick: this.onClickEdit,
      disabled: this.isAssessMenuItemDisable
    },
    { key: 'delete' }
  ];

  searchApplications = (application, textSearch) => {
    return application.candidate.name.toLowerCase().includes(textSearch.toLowerCase()) ||
           application.responsible.toLowerCase().includes(textSearch.toLowerCase()) ||
           application.opening.jobTitle.toLowerCase().includes(textSearch.toLowerCase()) ||
           application.opening.company.toLowerCase().includes(textSearch.toLowerCase());
  }

  render() {
    const { applications, refetchFn } = this.props;

    return (
      <EntityTable
        columns={this.columns}
        entities={applications}
        actionMenuItem={this.menuItems}
        deleteEntityGQL={DELETE_APPLICATION}
        refetchFn={refetchFn}
        searchFn={this.searchApplications}
        entityName="Application"
        paginationInfo={this.props.paginationInfo}
        paginationFn={this.props.paginationFn}
      ></EntityTable>
    )
  }
}

const DELETE_APPLICATION = gql`
  mutation Application($where: ApplicationWhereUniqueInput!) {
    deleteApplication(where: $where) {
      id
    }
  }
`;

// TODO: specify applications structure
ApplicationsTable.propTypes = {
  applications: PropTypes.array.isRequired,
  refetchFn: PropTypes.func,
  paginationFn: PropTypes.func,
  paginationInfo: PropTypes.object,
  assesFn: PropTypes.func.isRequired,
};
