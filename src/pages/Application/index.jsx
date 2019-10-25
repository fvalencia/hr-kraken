import React, { Component, Fragment } from 'react';
import { Query, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-boost';
import {
  Snackbar,
} from 'react-md';
import Moment from 'react-moment';

import { withPagination } from '../../components/shared/WithPagination';
import ApplicationsTable from '../../components/Applications/ApplicationsTable';
import { DATE_FORMAT } from '../../constants/dateFormat';
import ApplicationDialog from './dialog';
import Loading from '../../components/Loading';

class Application extends Component {
  state = { notifications: [], editMode: false };

  onClickEdit = application => {
    this.setState({ application });
  };

  onCloseModal = () => {
    this.setState({ application: null });
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

  render() {
    const { application, notifications } = this.state;
    let { paginationInfo, paginationFn } = this.props;
    const key = application ? application.id : 'create';
  
    return (
      <Fragment>
        <h1 className="page-h1">Applications</h1>
        <Query query={GET_APPLICATIONS} variables={{ skip: paginationInfo.start, first: paginationInfo.rowsPerPage }}>
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

            const { edges, aggregate } = data.applicationsConnection;

            // overwrite what we want to change from pagination
            paginationInfo.rows = aggregate.count;
            // Compute custom info to display for each application
            let applications = edges
              .map(edge => edge.node)
              .map(application => ({
                ...application,
                startDateOverview: application.startDate ? <Moment format={DATE_FORMAT} date={application.startDate} /> : '',
                endDateOverview: application.endDate ? <Moment format={DATE_FORMAT} date={application.endDate} /> : 'N/A',
                candidateOverview: <div className="">
                  <div className="">{application.candidate.name}</div>
                  <div className="hrk-fontSecondary">{application.candidate.email}</div>
                </div>,
                openingOverview: <div className="">
                  <div className="">{application.opening.jobTitle}</div>
                  <div className="hrk-fontSecondary">{application.opening.company}</div>
                </div>
              }));

            return (
              <Fragment>
                <ApplicationsTable
                  applications={applications}
                  assesFn={this.onClickEdit}
                  refetchFn={refetch}
                  paginationInfo={paginationInfo}
                  paginationFn={paginationFn}
                />
                <ApplicationDialog
                  onCompleted={value => this.onCompleted(value, refetch)}
                  onCloseModal={this.onCloseModal}
                  application={application}
                  type={key}
                  key={key}
                />
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
  query GetApplications($skip: Int, $first: Int) {
    applicationsConnection(skip: $skip, first: $first) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
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
        cursor
      }
      aggregate {
        count
      }
    }
  }
`;

export default compose(
  withRouter,
  withPagination
)(Application);
