import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Button } from 'react-md';

import Loading from '../../components/Loading';
import ErrorIndicator from '../../components/shared/ErrorIndicator';
import StepsCards from '../../components/Steps/StepsCards';
import UpsertStepModal from '../../components/Steps/UpsertStepModal';

class Steps extends Component {
  state = {
    UpsertStepModalVisible: false
  };

  openUpsertStepModal = () => {
    this.setState({ UpsertStepModalVisible: true });
  };

  UpsertStepModal = () => {
    this.setState({ UpsertStepModalVisible: false });
  };

  render() {
    const { UpsertStepModalVisible } = this.state;

    return (
      <Fragment>
        <h1 className="page-h1">Steps</h1>
        <Query query={STEPS_QUERY}>
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
                <StepsCards
                  steps={data && data.steps ? data.steps : []}
                  refetchFn={refetch}
                />
                <UpsertStepModal
                  visible={UpsertStepModalVisible}
                  onHide={this.UpsertStepModal}
                  afterUpsertSuccess={refetch}
                />
                <Button
                  floating
                  primary
                  onClick={this.openUpsertStepModal}
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

const STEPS_QUERY = gql`
  {
    steps {
      id
      name
      icon
    }
  }
`;

export default withRouter(Steps);
