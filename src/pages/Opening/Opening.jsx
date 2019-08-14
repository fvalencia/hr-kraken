import { gql } from 'apollo-boost';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { Button, DataTable, TableHeader, TableBody, TableRow, TableColumn, MenuButtonColumn, FontIcon } from 'react-md';
import { withRouter } from 'react-router-dom';
import OpeningDialog from './Dialog';

class Opening extends Component {
  state = {
    showOpeningDialog: false,
    opening: {
      id: null,
      jobTitle: '',
      jobDescription: '',
      company: '',
      maxSalaryRange: '',
      status: '',
      steps: []
    }
  };
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
    const showDialogValue = this.state.showOpeningDialog;
    this.setState({ showOpeningDialog: !showDialogValue });
  };

  onClickEdit = openingToEdit => {
    this.setState({ opening: openingToEdit });
    this.showDialog();
  };

  render() {
    return (
      <Fragment>
        <h1>Openings</h1>
        <Query query={openingsQuery}>
          {({ data, loading, error }) => {
            if (loading) return <p>Loading…</p>;
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
                        <TableColumn>{opening.maxSalaryRange}</TableColumn>
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
        <OpeningDialog
          showDialog={this.state.showOpeningDialog}
          opening={this.state.opening}
          // onCloseModal={this.onCloseModal}
          // application={application}
          // type={key}
          // key={key}
        />
        <Button floating primary onClick={this.showDialog}>
          <FontIcon>add</FontIcon>
        </Button>
      </Fragment>
    );
  }
}

const openingsQuery = gql`
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
        name
      }
    }
  }
`;

export default withRouter(Opening);
