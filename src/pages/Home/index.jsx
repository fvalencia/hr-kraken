import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';

class Home extends Component {
  render() {
    return (
      <Query query={POST_QUERY}>
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <div className="">
                <div>Loading ...</div>
              </div>
            );
          }

          if (error) {
            return (
              <div className="">
                <div>An unexpected error occured.</div>
              </div>
            );
          }

          const { applications } = data;
          return (
            <Fragment>
              <h1>Applications</h1>
              <p>{applications[0].startDate}</p>
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

const POST_QUERY = gql`
  {
    applications {
      startDate
      endDate
      id
      feedback
    }
  }
`;

export default withRouter(Home);
