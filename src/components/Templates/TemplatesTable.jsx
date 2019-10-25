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
  // TODO: ?restrict strings based on menuItems object keys in EntityTable
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

// TODO: specify templates and allSteps structures
TemplatesTable.propTypes = {
  templates: PropTypes.array.isRequired,
  refetchFn: PropTypes.func,
  allSteps: PropTypes.array.isRequired,
  paginationFn: PropTypes.func,
  paginationInfo: PropTypes.object
};
