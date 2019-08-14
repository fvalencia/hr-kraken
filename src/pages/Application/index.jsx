import React, { Component, Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn, MenuButtonColumn, FontIcon, Snackbar, TextField } from 'react-md';
import Moment from 'react-moment';
import { DATE_FORMAT } from '../../constants/dateFormat';
import ApplicationDialog from './dialog';
import Loading from '../../components/Loading';
import ConfirmDialog from '../../components/ConfirmDialog';
import { RESULTS } from '../../constants/result';
import Empty from '../../components/Empty';

class Application extends Component {
  state = { notifications: [], editMode: false };
  headers = [
    {
      key: 'startDate',
      name: 'Start Date'
    },
    {
      key: 'endDate',
      name: 'End Date'
    },
    // {
    //   key: 'feedback',
    //   name: 'Feedback'
    // },
    {
      key: 'responsible',
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
    this.setState({ application });
  };

  onClickDelete = application => {
    this.setState({ toDeleteApplication: application, alertVisible: true });
  };

  onCloseModal = () => {
    this.setState({ application: null });
  };

  onAlertEvent = (event, deleteApplicationFn) => {
    if (event === 'confirm') {
      const { toDeleteApplication } = this.state;
      deleteApplicationFn({
        variables: {
          where: {
            id: toDeleteApplication.id
          }
        }
      });
    }

    this.setState({ toDeleteApplication: null, alertVisible: false });
  };

  onCompleted = (isCreate, refetch) => {
    this.setState({
      notifications: [...this.state.notifications, { text: isCreate ? 'New application created' : 'Successfully assessed application' }]
    });
    refetch();
  };

  dismissToast = () => {
    const [, ...notifications] = this.state.notifications;
    this.setState({ notifications });
  };

  onTextChange = text => {
    this.setState({ textSearch: text });
  };

  menuItems = [
    {
      key: 'assess',
      leftIcon: <FontIcon>how_to_reg</FontIcon>,
      primaryText: 'Assess'
    },
    { divider: true },
    {
      key: 'delete',
      leftIcon: <FontIcon className="md-text--error">delete</FontIcon>,
      primaryText: <span className="md-text--error">Delete</span>
    }
  ];

  render() {
    const headers = this.headers;
    const { application, alertVisible = false, notifications, textSearch = '' } = this.state;
    const key = application ? application.id : 'create';
    return (
      <Fragment>
        <h1 className="page-h1">Applications</h1>
        <Query query={GET_APPLICATIONS}>
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

            let { applications } = data;
            applications = textSearch
              ? applications.filter(
                  a =>
                    a.candidate.name.toLowerCase().includes(textSearch.toLowerCase()) ||
                    a.opening.jobTitle.toLowerCase().includes(textSearch.toLowerCase()) ||
                    a.opening.company.toLowerCase().includes(textSearch.toLowerCase())
                )
              : applications;

            const noResults = !applications || !applications.length;

            return (
              <Fragment>
                <div className="md-grid right">
                  <TextField
                    id="search-field"
                    leftIcon={<FontIcon>search</FontIcon>}
                    lineDirection="left"
                    placeholder="Search by Text"
                    className="md-cell md-cell--bottom"
                    onChange={this.onTextChange}
                  />
                </div>
                {!noResults ? (
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
                        const { id, startDate, endDate, feedback, responsible, candidate, opening, result } = application;
                        return (
                          <TableRow key={id} selectable={false}>
                            <TableColumn>{startDate ? <Moment format={DATE_FORMAT} date={startDate} /> : ''}</TableColumn>
                            <TableColumn>{endDate ? <Moment format={DATE_FORMAT} date={endDate} /> : 'N/A'}</TableColumn>
                            {/* <TableColumn>{feedback}</TableColumn> */}
                            <TableColumn>{responsible}</TableColumn>
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
                            <TableColumn>{result ? RESULTS.find(r => r.value === result).label : ''}</TableColumn>
                            <MenuButtonColumn
                              icon
                              menuItems={this.menuItems.map(m =>
                                m.key === 'assess'
                                  ? { ...m, onClick: () => this.onClickEdit(application), disabled: !!endDate }
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
                ) : (
                  <div>
                    <Empty>ups we didn't find any results</Empty>
                  </div>
                )}
                <ApplicationDialog
                  onCompleted={value => this.onCompleted(value, refetch)}
                  onCloseModal={this.onCloseModal}
                  application={application}
                  type={key}
                  key={key}
                />
                <Mutation mutation={DELETE_APPLICATION} onCompleted={refetch}>
                  {deleteApplication => (
                    <ConfirmDialog
                      visible={alertVisible}
                      title="Alert"
                      message="Do you want to delete this application?"
                      onEvent={e => this.onAlertEvent(e, deleteApplication)}
                    />
                  )}
                </Mutation>
                <Snackbar toasts={notifications} onDismiss={this.dismissToast} />
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

const GET_APPLICATIONS = gql`
  {
    applications {
      startDate
      endDate
      id
      feedback
      responsible
      result
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

const DELETE_APPLICATION = gql`
  mutation Application($where: ApplicationWhereUniqueInput!) {
    deleteApplication(where: $where) {
      id
    }
  }
`;

export default withRouter(Application);
