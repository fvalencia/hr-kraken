import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';

import UpsertCandidateModal from './UpsertCandidateModal';
import EntityTable from '../shared/EntityTable';

// TODO: convert pure component, it's stateless
export default class CandidatesTable extends Component {
  columns = [
    { title: 'Name', propertyName: 'name'},
    { title: 'Title', propertyName: 'title'},
    { title: 'Email', propertyName: 'email'},
    { title: 'Status', propertyName: 'status'}
  ];

  // TODO: ?restrict strings based on menuItems object keys in EntityTable
  menuItems = [{ key: 'edit' },  { key: 'delete' }];

  searchCandidates = (candidate, textSearch) => {
    return candidate.name.toLowerCase().includes(textSearch.toLowerCase()) ||
           candidate.title.toLowerCase().includes(textSearch.toLowerCase()) ||
           candidate.email.toLowerCase().includes(textSearch.toLowerCase());
  }

  render() {
    const { candidates, refetchFn } = this.props;

    return (
      <EntityTable
        columns={this.columns}
        entities={candidates}
        actionMenuItem={this.menuItems}
        deleteEntityGQL={DELETE_CANDIDATE}
        refetchFn={refetchFn}
        searchFn={this.searchCandidates}
        entityName="Candidate"
        paginationInfo={this.props.paginationInfo}
        paginationFn={this.props.paginationFn}
        upsertEntityModal={
          <UpsertCandidateModal
            visible={false}
          />
        }
      ></EntityTable>
    )
  }
}

const DELETE_CANDIDATE = gql`
  mutation DeleteCandidate($where: CandidateWhereUniqueInput!) {
    deleteCandidate(where: $where) {
      id
    }
  }
`;

// TODO: specify candidates structure
CandidatesTable.propTypes = {
  candidates: PropTypes.array.isRequired,
  refetchFn: PropTypes.func,
  paginationFn: PropTypes.func,
  paginationInfo: PropTypes.object
};
