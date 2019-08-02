import React, { PureComponent, Fragment } from 'react';
import { Button, DialogContainer, DatePicker, TextField, Snackbar } from 'react-md';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import './styles.scss';
import Select from '../../components/Select';

class ApplicationDialog extends PureComponent {
  state = {
    notifications: [],
    visible: this.props.application ? true : false,
    application: this.props.application
      ? { ...this.props.application, candidate: this.props.application.candidate.id, opening: this.props.application.opening.id }
      : {
          startDate: null,
          endDate: null,
          candidate: null,
          opening: null,
          feedback: null,
          responsable: null,
          result: null
        }
  };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
    if (this.props.onCloseModal) {
      this.props.onCloseModal();
    }
  };

  handleKeyDown = e => {
    const key = e.which || e.keyCode;
    if (key === 13 || key === 32) {
      this.hide();
    }
  };

  onChange = (key, value) => {
    this.setState({ application: { [key]: value } });
  };

  onSubmit = addApplication => {
    const { startDate, responsible, candidate, opening } = this.state;
    addApplication({
      variables: {
        data: {
          startDate: startDate.toISOString(),
          responsable: responsible,
          candidate: { connect: { id: candidate } },
          opening: { connect: { id: opening } }
        }
      }
    });
    this.hide();
  };

  onCompleted = () => {
    this.setState({ notifications: [...this.state.notifications, { text: 'New Application Created' }] });
    // Refresh on change.
    if (this.props.onApplicationsChange) {
      this.props.onApplicationsChange();
    }
  };

  dismissToast = () => {
    const [, ...notifications] = this.state.notifications;
    this.setState({ notifications });
  };

  render() {
    const { visible, notifications, application } = this.state;
    const { candidate, opening, startDate, responsable } = application;
    const disabled = !candidate || !opening || !startDate || !responsable;
    const title = this.props.type === 'create' ? 'Add' : 'Edit';
    const buttonText = this.props.type === 'create' ? 'Add' : 'Save';
    return (
      <div>
        <Button floating primary className="add-button" onClick={this.show}>
          add
        </Button>
        <Mutation mutation={ADD_APPLICATION} onCompleted={this.onCompleted}>
          {addApplication => (
            <Fragment>
              <DialogContainer
                id="simple-list-dialog"
                visible={visible}
                title={`${title} Application`}
                onHide={this.hide}
                actions={[
                  { secondary: true, children: 'Cancel', onClick: this.hide, type: 'button' },
                  { secondary: false, children: buttonText, onClick: () => this.onSubmit(addApplication), disabled, type: 'submit' }
                ]}
                className="application-dialog"
              >
                <div className="md-grid">
                  <DatePicker
                    id="appointment-date-auto"
                    label="Star Date"
                    className="md-cell md-cell--12"
                    portal={true}
                    lastChild={true}
                    disableScrollLocking={true}
                    defaultValue={application.startDate ? new Date(application.startDate) : undefined}
                    renderNode={document.body}
                    required
                    onChange={(_, dateObject) => this.onChange('startDate', dateObject)}
                    errorText={`this field is required`}
                  />
                  <TextField
                    id="floating-center-title"
                    className="md-cell md-cell--12"
                    label="Responsible"
                    lineDirection="left"
                    placeholder="Add responsible name"
                    defaultValue={application.responsable || undefined}
                    required
                    onChange={value => this.onChange('responsible', value)}
                    errorText={`this field is required`}
                  />
                  <Query query={QUERY}>
                    {({ data }) => {
                      const { candidates, openings } = data;
                      return (
                        <Fragment>
                          <Select
                            defaultValue={application.candidate || undefined}
                            label="Candidate"
                            placeholder="Select a Candidate"
                            searchPlaceholder="Search by Name"
                            onChange={value => this.onChange('candidate', value)}
                            menuItems={candidates ? candidates.map(candidate => ({ value: candidate.id, label: candidate.name })) : []}
                          />
                          <Select
                            defaultValue={application.opening || undefined}
                            label="Opening"
                            placeholder="Select an Opening"
                            searchPlaceholder="Search by Opening"
                            onChange={value => this.onChange('opening', value)}
                            menuItems={openings ? openings.map(opening => ({ value: opening.id, label: opening.jobTitle })) : []}
                          />
                        </Fragment>
                      );
                    }}
                  </Query>
                </div>
              </DialogContainer>
              <Snackbar toasts={notifications} onDismiss={this.dismissToast} />
            </Fragment>
          )}
        </Mutation>
      </div>
    );
  }
}

const QUERY = gql`
  {
    openings {
      company
      id
      jobTitle
    }
    candidates {
      name
      id
    }
  }
`;

const ADD_APPLICATION = gql`
  mutation Application($data: ApplicationCreateInput!) {
    createApplication(data: $data) {
      id
    }
  }
`;

export default ApplicationDialog;
