import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn, MenuButtonColumn, FontIcon } from 'react-md';
import Moment from 'react-moment';
import { DATE_FORMAT } from '../../constants/dateFormat';
import ApplicationDialog from './dialog';
import Loading from '../../components/Loading';

class Application extends Component {
  // startDate
  // endDate
  // feedback
  // responsable
  // result
  // candidate
  // opening
  // steps
  headers = [
    {
      key: 'startDate',
      name: 'Start Date'
    },
    {
      key: 'endDate',
      name: 'End Date'
    },
    {
      key: 'feedback',
      name: 'Feedback'
    },
    {
      key: 'responsable',
      name: 'Responsible'
    },
    {
      key: 'candidate',
      name: 'Candidate'
    },
    {
      key: 'opening',
      name: 'Opening'
    },
    {
      key: 'result',
      name: 'Result'
    }
  ];

  onClickEdit = application => {
    console.log('onClickEdit --->', application);
    this.setState({ application });
  };

  onClickDelete = application => {
    console.log('onClickDelete --->', application);
  };

  onCloseModal = () => {
    this.setState({ application: null });
  };

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

  state = { editMode: false };

  render() {
    const headers = this.headers;
    const { application } = this.state;
    const key = application ? application.id : 'create';
    return (
      <Query query={POST_QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return <Loading />;
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
              <h1 className="page-h1">Applications</h1>
              <DataTable baseId="table-applications">
                <TableHeader>
                  <TableRow selectable={false}>
                    {headers.map(({ name, ...props }, i) => (
                      <TableColumn {...props}>{name}</TableColumn>
                    ))}
                    <TableColumn />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map(application => {
                    const { id, startDate, endDate, feedback, responsable, candidate, opening, result } = application;
                    return (
                      <TableRow key={id} selectable={false}>
                        <TableColumn>{startDate ? <Moment format={DATE_FORMAT} date={startDate} /> : ''}</TableColumn>
                        <TableColumn>{endDate ? <Moment format={DATE_FORMAT} date={endDate} /> : 'N/A'}</TableColumn>
                        <TableColumn>{feedback}</TableColumn>
                        <TableColumn>{responsable}</TableColumn>
                        <TableColumn>
                          <div className="">
                            <div className="">{candidate.name}</div>
                            <div className="hrk-fontSecondary">{candidate.email}</div>
                          </div>
                        </TableColumn>
                        <TableColumn>
                          <div className="">
                            <div className="">{opening.jobTitle}</div>
                            <div className="hrk-fontSecondary">{opening.company}</div>
                          </div>
                        </TableColumn>
                        <TableColumn>{result}</TableColumn>
                        <MenuButtonColumn
                          icon
                          menuItems={this.menuItems.map(m =>
                            m.key === 'edit'
                              ? { ...m, onClick: () => this.onClickEdit(application) }
                              : { ...m, onClick: () => this.onClickDelete(application) }
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
              <ApplicationDialog onApplicationsChange={refetch} onCloseModal={this.onCloseModal} application={application} type={key} key={key} />
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
      responsable
      candidate {
        id
        name
        email
      }
      opening {
        id
        company
        jobTitle
        jobDescription
      }
      steps {
        feedback
        completionDate
        step {
          name
          id
        }
      }
    }
  }
`;

export default withRouter(Application);
