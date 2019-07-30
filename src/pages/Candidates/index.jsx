import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';

import LoadingIndicator from '../../components/shared/LoadingIndicator';
import ErrorIndicator from '../../components/shared/ErrorIndicator';
import CandidatesTable from '../../components/Candidates/CandidatesTable';

class Candidates extends Component {
  render() {
    return (
      <Query query={CANDIDATES_QUERY}>
        {({ data, loading, error }) => {
          if (error) {
            return (
              <ErrorIndicator errorMessage="An unexpected error occured." />
            );
          }

          return (
            <Fragment>
              <h1>Candidates</h1>
              <LoadingIndicator isLoading={loading} />
              <CandidatesTable
                candidates={data && data.candidates ? data.candidates : []}
              />
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
