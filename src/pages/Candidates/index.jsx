import React, { Component, Fragment } from 'react';
import { Query, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Button } from 'react-md';

import { withPagination } from '../../components/shared/WithPagination';
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
    let { paginationInfo, paginationFn } = this.props;

    return (
      <Fragment>
        <h1 className="page-h1">Candidates</h1>
        <Query query={CANDIDATES_QUERY} variables={{ skip: paginationInfo.start, first: paginationInfo.rowsPerPage }}>
          {({ data, loading, error, refetch }) => {
            if (loading) {
              return <Loading />;
            }

            if (error) {
              return (
                <ErrorIndicator errorMessage="An unexpected error occurred." />
              );
            }

            const { edges, aggregate } = data.candidatesConnection;

            // overwrite what we want to change from pagination
            paginationInfo.rows = aggregate.count;
            const candidates = edges.map(edge => edge.node);

            return (
              <Fragment>
                <CandidatesTable
                  candidates={candidates}
                  refetchFn={refetch}
                  paginationInfo={paginationInfo}
                  paginationFn={paginationFn}
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
  query GetCandidates($skip: Int, $first: Int) {
    candidatesConnection(skip: $skip, first: $first) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
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
        cursor
      }
      aggregate {
        count
      }
    }
  }
`;

export default compose(
  withRouter,
  withPagination
)(Candidates);
