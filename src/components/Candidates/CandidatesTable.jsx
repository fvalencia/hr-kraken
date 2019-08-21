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
  TableColumn,
  TextField
} from 'react-md';

import ColumnKebabMenu from '../shared/ColumnKebabMenu';
import ConfirmDialog from '../../components/ConfirmDialog';
import Empty from '../../components/Empty';
import UpsertCandidateModal from './UpsertCandidateModal';

export default class CandidatesTable extends Component {
  state = {
    alertVisible: false,
    candidateToDelete: null,
    upsertCandidateModalVisible: false,
    candidateToEdit: null,
    textSearch: ''
  };

  editCandidate = candidate => {
    return () => {
      this.setState({
        candidateToEdit: candidate,
        upsertCandidateModalVisible: true
      });
    };
  };

  closeUpsertCandidateModal = () => {
    this.setState({ upsertCandidateModalVisible: false });
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

  deleteCandidateCompleted = () => {
    // TODO: show toast message and emit so the table re-fetch the data
    console.warn('Delete candidate successfully, show message');
    this.props.refetchFn();
  };

  deleteCandidateError = e => {
    // TODO: show toast message with the error OR prevent allowing to delete the candidate if has current applications
    console.warn('Delete candidate ERROR, show message', e);
  };

  onTextChange = text => {
    this.setState({ textSearch: text });
  };

  render() {
    const {
      alertVisible,
      upsertCandidateModalVisible,
      candidateToEdit,
      textSearch
    } = this.state;

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

    const candidatesFiltered = textSearch.length
      ? this.props.candidates.filter(
          c =>
            c.name.toLowerCase().includes(textSearch.toLowerCase()) ||
            c.title.toLowerCase().includes(textSearch.toLowerCase()) ||
            c.email.toLowerCase().includes(textSearch.toLowerCase())
        )
      : this.props.candidates;

    return (
      <Fragment>
        <div className="md-grid right">
          <TextField
            id="search-field"
            leftIcon={<FontIcon>search</FontIcon>}
            lineDirection="left"
            placeholder="Search by Text"
            className="md-cell md-cell--bottom"
            onChange={this.onTextChange}
          />
        </div>
        {candidatesFiltered.length ? (
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
                {candidatesFiltered.map(candidate => (
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
            <Mutation
              mutation={DELETE_CANDIDATE}
              onCompleted={this.deleteCandidateCompleted}
              onError={this.deleteCandidateError}
            >
              {deleteCandidate => (
                <ConfirmDialog
                  visible={alertVisible}
                  title="Alert"
                  message="Do you want to delete this candidate?"
                  onEvent={e => this.onAlertEvent(e, deleteCandidate)}
                />
              )}
            </Mutation>
            <UpsertCandidateModal
              visible={upsertCandidateModalVisible}
              onHide={this.closeUpsertCandidateModal}
              candidate={candidateToEdit}
              afterUpsertSuccess={this.props.refetchFn}
            />
          </Fragment>
        ) : (
          <div>
            <Empty>ups we didn't find any results</Empty>
          </div>
        )}
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
  refetchFn: PropTypes.func
};
