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

CandidatesTable.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    email: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    salaryExpectation: PropTypes.number,
    seniority: PropTypes.string.isRequired, //? enum
    skypeId: PropTypes.string,
    status: PropTypes.string.isRequired, //? enum
    title: PropTypes.string.isRequired,
    yearsOfExperience: PropTypes.number,
  })).isRequired,
  refetchFn: PropTypes.func,
  paginationFn: PropTypes.func,
  paginationInfo: PropTypes.object
};
