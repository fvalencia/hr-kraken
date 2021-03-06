import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Button } from 'react-md';

import Loading from '../../components/Loading';
import ErrorIndicator from '../../components/shared/ErrorIndicator';
import CandidatesTable from '../../components/Candidates/CandidatesTable';
import UpsertCandidateModal from '../../components/Candidates/UpsertCandidateModal';

// ? why on UPDATE candidate refetch not displaying loading indicator while on INSERT candidate refetch does
class Candidates extends Component {
  state = {
    upsertCandidateModalVisible: false
  };

  openUpsertCandidateModal = () => {
    this.setState({ upsertCandidateModalVisible: true });
  };

  closeUpsertCandidateModal = () => {
    this.setState({ upsertCandidateModalVisible: false });
  };

  render() {
    const { upsertCandidateModalVisible } = this.state;

    return (
      <Fragment>
        <h1 className="page-h1">Candidates</h1>
        <Query query={CANDIDATES_QUERY}>
          {({ data, loading, error, refetch }) => {
            if (loading) {
              return <Loading />;
            }

            if (error) {
              return (
                <ErrorIndicator errorMessage="An unexpected error occurred." />
              );
            }

            return (
              <Fragment>
                <CandidatesTable
                  candidates={data && data.candidates ? data.candidates : []}
                  refetchFn={refetch}
                />
                <UpsertCandidateModal
                  visible={upsertCandidateModalVisible}
                  onHide={this.closeUpsertCandidateModal}
                  afterUpsertSuccess={refetch}
                />
                <Button
                  floating
                  primary
                  onClick={this.openUpsertCandidateModal}
                  className="bottom-right"
                >
                  add
                </Button>
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
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
      yearsOfExperience
      phone
      skypeId
      salaryExpectation
      seniority
      status
    }
  }
`;

export default withRouter(Candidates);
