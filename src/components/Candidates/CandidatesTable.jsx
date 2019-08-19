import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import {
  DataTable,
  FontIcon,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn
} from 'react-md';

import ColumnKebabMenu from '../shared/ColumnKebabMenu';
import ConfirmDialog from '../../components/ConfirmDialog';

export default class CandidatesTable extends Component {
  state = {
    alertVisible: false,
    candidateToDelete: null
  };

  editCandidate = candidate => {
    return () => {
      this.props.editCandidate(candidate);
    };
  };

  deleteCandidate = candidate => {
    return () => {
      this.setState({ candidateToDelete: candidate, alertVisible: true });
    };
  };

  onAlertEvent = (event, deleteCandidateFn) => {
    if (event === 'confirm') {
      const { candidateToDelete } = this.state;
      deleteCandidateFn({
        variables: {
          where: {
            id: candidateToDelete.id
          }
        }
      });
    }

    this.setState({ candidateToDelete: null, alertVisible: false });
  };

  render() {
    const { alertVisible } = this.state;

    const menuItems = [
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

    return (
      <Fragment>
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
            {this.props.candidates.map(candidate => (
              <TableRow key={candidate.id}>
                <TableColumn>{candidate.name}</TableColumn>
                <TableColumn>{candidate.title}</TableColumn>
                <TableColumn>{candidate.email}</TableColumn>
                <TableColumn>{candidate.status}</TableColumn>
                <ColumnKebabMenu
                  menuItems={menuItems.map(mi => ({
                    ...mi,
                    onClick: mi.onClick(candidate) // update each function with the correspondent candidate
                  }))}
                />
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
        {/*  onCompleted={refetch} */}
        <Mutation mutation={DELETE_CANDIDATE}>
          {deleteCandidate => (
            <ConfirmDialog
              visible={alertVisible}
              title="Alert"
              message="Do you want to delete this candidate?"
              onEvent={e => this.onAlertEvent(e, deleteCandidate)}
            />
          )}
        </Mutation>
      </Fragment>
    );
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
  candidates: PropTypes.array.isRequired,
  editCandidate: PropTypes.func
};
