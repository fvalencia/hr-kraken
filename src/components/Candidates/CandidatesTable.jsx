import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
} from 'react-md';

import CandidateRowKebabMenu from './CandidateRowKebabMenu';

export default class CandidatesTable extends Component {
  render() {
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            <TableColumn>Name</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn />
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.props.candidates.map((candidate, i) => (
            <TableRow key={candidate.id}>
              <TableColumn>{candidate.name}</TableColumn>
              <TableColumn>{candidate.title}</TableColumn>
              <TableColumn>{candidate.email}</TableColumn>
              <TableColumn>{candidate.status}</TableColumn>
              <CandidateRowKebabMenu candidate={candidate}/>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>
    );
  }
}

CandidatesTable.propTypes = {
  candidates: PropTypes.array.isRequired
};
