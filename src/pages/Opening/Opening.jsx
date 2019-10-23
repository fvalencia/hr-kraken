import { gql } from 'apollo-boost';
import React, { Component, Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Button, DataTable, TableHeader, TableBody, TableRow, TableColumn, Snackbar, MenuButtonColumn, FontIcon } from 'react-md';
import { withRouter } from 'react-router-dom';
import OpeningDialog from './Dialog';
import Loading from '../../components/Loading';
import NumberFormat from 'react-number-format';
import ConfirmDialog from '../../components/ConfirmDialog';

class Opening extends Component {
  state = {
    showOpeningDialog: false,
    openingToDelete: null,
    alertVisible: false,
    toasts: []
  };

  emptyOpening = {
    id: null,
    jobTitle: '',
    jobDescription: '',
    company: '',
    maxSalaryRange: '',
    status: '',
    steps: [],
    applications: []
  };

  opening = this.emptyOpening;
  headers = ['Job Title', 'Job Description', 'Company', 'Max Salary Range', 'Status'];
  menuItems = [
    {
      key: 'edit',
      leftIcon: <FontIcon>edit</FontIcon>,
      primaryText: 'Edit'
    },
    { divider: true },
    {
      key: 'delete',
      leftIcon: <FontIcon className="md-text--error">delete</FontIcon>,
      primaryText: <span className="md-text--error">Delete</span>
    }
  ];

  showDialog = () => {
    this.setState({ showOpeningDialog: true });
  };

  hideDialog = () => {
    this.setState({ showOpeningDialog: false });
    this.opening = this.emptyOpening;
  };

  onClickEdit = openingToEdit => {
    this.opening = {
      ...openingToEdit,
      steps: openingToEdit.steps.map(step => step.id),
      applications: openingToEdit.applications.map(application => application.id)
    };
    this.showDialog();
  };

  onClickDelete = openingToDelete => {
    this.setState({ openingToDelete: openingToDelete.id, alertVisible: true });
  };

  onDeleteEvent = (event, deleteApplicationFn) => {
    if (event === 'confirm') {
      const { openingToDelete } = this.state;
      deleteApplicationFn({
        variables: {
          where: {
            id: openingToDelete
          }
        }
      });
    }
  };

  onSaveSuccess = () => {
    if (this.opening.id) {
      this.addToast('Opening Updated Successfully!');
    } else {
      this.addToast('Opening Added Successfully!');
    }
    this.hideDialog();
  };

  onDeleteSuccess = () => {
    this.addToast('Opening Deleted Successfully!');
    this.setState({ toDeleteApplication: null, alertVisible: false });
  };

  onSaveError = error => {
    if (error.message) {
      this.addToast(error.message);
    } else {
      this.addToast('Something happened, check the info and try again...');
    }
  };

  addToast = message => {
    this.setState({
      toasts: [...this.state.toasts, { text: message }]
    });
  };

  dismissToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  };

  render() {
    const { toasts, alertVisible } = this.state;
    return (
      <Fragment>
        <h1>Openings</h1>
        <Query query={OPENING_QUERY}>
          {({ data, loading, error }) => {
            if (loading) return <Loading />;
            if (error) return <p>Something went wrong</p>;
            const { openings } = data;
            return (
              <DataTable plain>
                <TableHeader>
                  <TableRow key="header">
                    {this.headers.map((header, index) => {
                      return <TableColumn key={`${header}${index}`}>{header}</TableColumn>;
                    })}
                    <TableColumn />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openings.map(opening => {
                    const openingId = opening.id;
                    return (
                      <TableRow key={openingId}>
                        <TableColumn>{opening.jobTitle}</TableColumn>
                        <TableColumn>{opening.jobDescription}</TableColumn>
                        <TableColumn>{opening.company}</TableColumn>
                        <TableColumn>
                          <NumberFormat value={opening.maxSalaryRange} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        </TableColumn>
                        <TableColumn>{opening.status}</TableColumn>
                        <MenuButtonColumn
                          icon
                          menuItems={this.menuItems.map(m =>
                            m.key === 'edit'
                              ? { ...m, onClick: () => this.onClickEdit(opening) }
                              : { ...m, onClick: () => this.onClickDelete(opening) }
                          )}
                          listClassName="action-menu"
                        >
                          <FontIcon>more_vert</FontIcon>
                        </MenuButtonColumn>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </DataTable>
            );
          }}
        </Query>
        <Mutation
          mutation={UPSERT_OPENING}
          onCompleted={this.onSaveSuccess}
          onError={this.onSaveError}
          refetchQueries={[{ query: OPENING_QUERY }]}
          awaitRefetchQueries={true}
        >
          {createUpdateOpening => (
            <OpeningDialog
              showDialog={this.state.showOpeningDialog}
              openingToEdit={this.opening}
              hideModal={this.hideDialog}
              createUpdateMutation={createUpdateOpening}
            />
          )}
        </Mutation>
        <Mutation
          mutation={DELETE_OPENING}
          onCompleted={this.onDeleteSuccess}
          refetchQueries={[{ query: OPENING_QUERY }]}
          awaitRefetchQueries={true}
        >
          {deleteOpening => (
            <ConfirmDialog
              visible={alertVisible}
              title="Alert"
              message="Do you want to delete this opening?"
              onEvent={e => this.onDeleteEvent(e, deleteOpening)}
            />
          )}
        </Mutation>
        <Button floating primary className="bottom-right" onClick={this.showDialog}>
          <FontIcon>add</FontIcon>
        </Button>
        <Snackbar toasts={toasts} autohide={true} onDismiss={this.dismissToast} />
      </Fragment>
    );
  }
}

const OPENING_QUERY = gql`
  {
    openings {
      id
      jobTitle
      jobDescription
      company
      maxSalaryRange
      status
      steps {
        id
      }
      applications {
        id
      }
    }
  }
`;

const UPSERT_OPENING = gql`
  mutation upsertOpening($where: OpeningWhereUniqueInput!, $create: OpeningCreateInput!, $update: OpeningUpdateInput!) {
    upsertOpening(where: $where, create: $create, update: $update) {
      id
    }
  }
`;

const DELETE_OPENING = gql`
  mutation UpdateOpening($where: OpeningWhereUniqueInput!) {
    deleteOpening(where: $where) {
      id
    }
  }
`;

export default withRouter(Opening);
