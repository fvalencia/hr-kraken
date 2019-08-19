import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Button } from 'react-md';

import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorIndicator from '../../components/shared/ErrorIndicator';
import CandidatesTable from '../../components/Candidates/CandidatesTable';
import NewCandidate from '../../components/Candidates/NewCandidate';

class Candidates extends Component {
  state = {
    newCandidateModalVisible: false
  };

  openNewCandidateModal = () => {
    this.setState({ newCandidateModalVisible: true });
  };

  closeNewCandidateModal = () => {
    this.setState({ newCandidateModalVisible: false });
  };

  editCandidate = candidate => {
    console.warn('Not Implemented yet. Edit Candidate ->', candidate.name);
  };

  render() {
    const { newCandidateModalVisible } = this.state;

    return (
      <Query query={CANDIDATES_QUERY}>
        {({ data, loading, error }) => {
          if (error) {
            return (
              <ErrorIndicator errorMessage="An unexpected error occurred." />
            );
          }

          return (
            <Fragment>
              <h1>Candidates</h1>
              <LoadingIndicator isLoading={loading} />
              <CandidatesTable
                candidates={data && data.candidates ? data.candidates : []}
                editCandidate={this.editCandidate}
              />
              <NewCandidate
                visible={newCandidateModalVisible}
                onHide={this.closeNewCandidateModal}
              />
              <Button
                floating
                primary
                onClick={this.openNewCandidateModal}
                className="bottom-right"
              >
                add
              </Button>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

const CANDIDATES_QUERY = gql`
  {
    candidates {
      id
      name
      title
      email
      status
    }
  }
`;

export default withRouter(Candidates);
