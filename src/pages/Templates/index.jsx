import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Button } from 'react-md';

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
    const loading = getSteps.loading || getTemplates.loading;
    const error = !!getSteps.error || !!getTemplates.error;

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
                templates={getTemplates.templateSteps}
                allSteps={getSteps.steps}
                refetchFn={getTemplates.refetch}
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
  {
    templateSteps {
      id
      name
      steps {
        id
        name
        icon
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
  graphql(TEMPLATE_STEPS_QUERY, { name: 'getTemplates' }),
  graphql(STEPS_QUERY, { name: 'getSteps' }) // ? error in the second one - app explodes and .error is undefined
)(Templates);
