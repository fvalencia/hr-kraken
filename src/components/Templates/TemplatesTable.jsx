import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import UpsertTemplateModal from './UpsertTemplateModal';
import EntityTable from '../shared/EntityTable';

export default class TemplatesTable extends Component {
  columns = [
    { title: 'Name', propertyName: 'name'},
    { title: 'Steps', propertyName: 'steps'}
  ];
  menuItems = [{ key: 'edit' },  { key: 'delete' }];

  searchTemplates = (template, textSearch) => {
    return template.name.toLowerCase().includes(textSearch.toLowerCase());
  }

  render() {
    const { templates, allSteps, refetchFn } = this.props;
    return (
      <EntityTable
        columns={this.columns}
        entities={templates}
        actionMenuItem={this.menuItems}
        deleteEntityGQL={DELETE_TEMPLATE}
        refetchFn={refetchFn}
        searchFn={this.searchTemplates}
        entityName="Template"
        paginationInfo={this.props.paginationInfo}
        paginationFn={this.props.paginationFn}
        upsertEntityModal={
          <UpsertTemplateModal
            visible={false}
            allSteps={allSteps}
          />
        }
      ></EntityTable>
    );
  }
}

const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($where: TemplateStepWhereUniqueInput!) {
    deleteTemplateStep(where: $where) {
      id
    }
  }
`;

const stepsModel = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
})).isRequired

TemplatesTable.propTypes = {
  templates: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    steps: stepsModel
  })).isRequired,
  refetchFn: PropTypes.func,
  allSteps: stepsModel,
  paginationFn: PropTypes.func,
  paginationInfo: PropTypes.object
};
