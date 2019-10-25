import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Button } from 'react-md';

import { withPagination } from '../../components/shared/WithPagination';
import Loading from '../../components/Loading';
import ErrorIndicator from '../../components/shared/ErrorIndicator';
import UpsertTemplateModal from '../../components/Templates/UpsertTemplateModal';
import TemplatesTable from '../../components/Templates/TemplatesTable';

class Templates extends Component {
  state = {
    UpsertTemplateModalVisible: false
  };

  openUpsertTemplateModal = () => {
    this.setState({ UpsertTemplateModalVisible: true });
  };

  UpsertTemplateModal = () => {
    this.setState({ UpsertTemplateModalVisible: false });
  };

  render() {
    const { UpsertTemplateModalVisible } = this.state;
    const { getSteps, getTemplates } = this.props;
    let { paginationInfo, paginationFn } = this.props;
    const loading = getSteps.loading || getTemplates.loading;
    let error = !!getSteps.error || !!getTemplates.error;

    let templateSteps = [];
    if (!loading && getTemplates.templateStepsConnection) {
      const { edges, aggregate } = getTemplates.templateStepsConnection;
      
      // overwrite what we want to change from pagination
      paginationInfo.rows = aggregate.count;
      templateSteps = edges.map(edge => edge.node);
    } else {
      error = true;
    } 

    return (
      <Fragment>
        <h1 className="page-h1">Templates</h1>
        {(() => {
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
              <TemplatesTable
                templates={templateSteps}
                allSteps={getSteps.steps}
                refetchFn={getTemplates.refetch}
                paginationInfo={paginationInfo}
                paginationFn={paginationFn}
              ></TemplatesTable>
              <UpsertTemplateModal
                visible={UpsertTemplateModalVisible}
                onHide={this.UpsertTemplateModal}
                afterUpsertSuccess={getTemplates.refetch}
                allSteps={getSteps.steps}
              />
              <Button
                floating
                primary
                onClick={this.openUpsertTemplateModal}
                className="bottom-right"
              >
                add
              </Button>
            </Fragment>
          );
        })()}
      </Fragment>
    );
  }
}

const TEMPLATE_STEPS_QUERY = gql`
  query GetTemplateSteps($skip: Int, $first: Int) {
    templateStepsConnection(skip: $skip, first: $first) {
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
          steps {
            id
            name
            icon
          }
        }
        cursor
      }
      aggregate {
        count
      }
    }
  }
`;

const STEPS_QUERY = gql`
  {
    steps {
      id
      name
      icon
    }
  }
`;

export default compose(
  withRouter,
  withPagination,
  graphql(TEMPLATE_STEPS_QUERY, {
    name: 'getTemplates',
    options: (props) => ({
      variables: {
        skip: props.paginationInfo.start,
        first: props.paginationInfo.rowsPerPage
      }
    })
  }),
  graphql(STEPS_QUERY, { name: 'getSteps' }) // ? error in the second one - app explodes and .error is undefined
)(Templates);
