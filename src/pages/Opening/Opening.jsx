import { gql } from 'apollo-boost';
import React, { Component, Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Button, DataTable, TableHeader, TableBody, TableRow, TableColumn, MenuButtonColumn, FontIcon } from 'react-md';
import { withRouter } from 'react-router-dom';
import OpeningDialog from './Dialog';
import Loading from '../../components/Loading';
import NumberFormat from 'react-number-format';

class Opening extends Component {
  state = {
    showOpeningDialog: false
  };

  emptyOpening = {
    id: null,
    jobTitle: '',
    jobDescription: '',
    company: '',
    maxSalaryRange: '',
    status: '',
    steps: []
  };

  opening = this.emptyOpening;
  headers = ['Job Title', 'Job Description', 'Company', 'Max Salary Range', 'status'];
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
    openingToEdit.steps = openingToEdit.steps.map(step => step.id);
    this.opening = openingToEdit;
    this.showDialog();
  };

  onClickDelete = openingToEdit => {
    this.opening = openingToEdit;
    this.showDialog();
  };

  render() {
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
        {/* <Mutation mutation={!this.opening.id ? ADD_OPENING : UPDATE_OPENING} onCompleted={() => this.hideDialog()}> */}
        <OpeningDialog
          showDialog={this.state.showOpeningDialog}
          opening={this.opening}
          hideModal={this.hideDialog}
          // onCloseModal={this.onCloseModal}
          // onClick={() => this.saveOpening(opening)}
          // type={key}
          // key={key}
        />
        {/* </Mutation> */}
        <Button floating primary onClick={this.showDialog}>
          <FontIcon>add</FontIcon>
        </Button>
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
    }
  }
`;

const ADD_OPENING = gql`
  mutation AddOpening($data: OpeningCreateInput!) {
    createOpening(data: $data) {
      id
    }
  }
`;

const UPDATE_OPENING = gql`
  mutation UpdateOpening($data: OpeningCreateInput!, $where: OpeningWhereUniqueInput!) {
    updateOpening(data: $data, where: $where) {
      id
    }
  }
`;

export default withRouter(Opening);
