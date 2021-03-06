import { gql } from 'apollo-boost';
import React, { PureComponent, Fragment } from 'react';
import { Query } from 'react-apollo';
import { Button, DialogContainer, FontIcon, List, ListItem, TextField } from 'react-md';
import Select from '../../components/Select';
import Loading from '../../components/Loading';
import PropTypes from 'prop-types';
import './Dialog.scss';

class OpeningDialog extends PureComponent {
  state = {
    visible: false,
    opening: { id: null, jobTitle: '', jobDescription: '', company: '', maxSalaryRange: '', status: '', steps: [], applications: [] }
  };
  buttonText = 'save';
  // TODO: Fetch these values from DB
  openingStatus = ['OPEN', 'CLOSED'];

  show = () => {
    const openingValue = this.props.openingToEdit;
    this.setState({
      visible: true,
      opening: openingValue
    });
  };

  hide = () => {
    this.setState({
      visible: false
    });
  };

  validateFields = () => {
    const opening = this.state.opening;
    return (
      !opening.jobTitle ||
      !opening.jobDescription ||
      !opening.company ||
      !opening.maxSalaryRange ||
      !opening.status ||
      !opening.steps.length
    );
  };

  componentDidUpdate = prevProps => {
    if (this.props.showDialog !== prevProps.showDialog) {
      this.props.showDialog ? this.show() : this.hide();
    }
  };

  selectStep = step => {
    this.setState({
      opening: {
        ...this.state.opening,
        steps: [...this.state.opening.steps, step]
      }
    });
  };

  deleteStep = step => {
    const steps = this.state.opening.steps.filter(openingStep => openingStep !== step);
    this.setState({
      opening: {
        ...this.state.opening,
        steps
      }
    });
  };

  updateOpeningField = (field, value) => {
    this.setState({ opening: { ...this.state.opening, [field]: value } });
  };

  onSubmit = createUpdateOpeningFn => {
    let opening = this.state.opening;
    const where = opening.id ? { id: opening.id } : { id: '' };

    // deletes not allowed properties
    delete opening['__typename'];
    delete opening['id'];

    // prepares data according to the model
    const steps = opening.steps.length ? { connect: opening.steps.map(openingId => ({ id: openingId })) } : undefined;
    const stepsToRemove = this.props.openingToEdit.steps.reduce((acc, step) => {
      if (opening.steps.indexOf(step) < 0) {
        acc.push({ id: step });
      }
      return acc;
    }, []);

    if (stepsToRemove.length > 0) {
      steps['disconnect'] = stepsToRemove;
    }

    opening = {
      ...opening,
      maxSalaryRange: parseFloat(opening.maxSalaryRange),
      steps
    };

    createUpdateOpeningFn({
      variables: {
        create: opening,
        update: opening,
        where
      }
    });
  };

  render() {
    const visible = this.state.visible;
    let opening = this.state.opening;
    const disabled = this.validateFields();
    const actions = [
      { secondary: true, children: 'Cancel', onClick: this.props.hideModal, type: 'button' },
      {
        secondary: false,
        children: this.buttonText,
        onClick: () => this.onSubmit(this.props.createUpdateMutation),
        disabled,
        type: 'submit'
      }
    ];

    return (
      <div className="opening-dialog-container">
        <DialogContainer
          className="opening-dialog"
          id="simple-list-dialog"
          focusOnMount={false}
          actions={actions}
          visible={visible}
          title={opening.id ? 'Edit Opening' : 'New Opening'}
          onHide={this.props.hideModal}
        >
          <Query query={applicationAndStepsQuery}>
            {({ data, loading, error }) => {
              if (loading)
                return (
                  <div className="loading-container">
                    <Loading />
                  </div>
                );
              if (error) return <p>Something went wrong</p>;
              const { steps, applications } = data;
              const filteredSteps = steps.filter(step => opening.steps.every(opStepId => opStepId !== step.id));
              this.isLoading = false;
              return (
                <Fragment>
                  <TextField
                    id="floating-center-title"
                    className="md-cell md-cell--12"
                    label="Job Title"
                    lineDirection="left"
                    placeholder="Add Job Title"
                    defaultValue={opening.jobTitle || undefined}
                    onChange={value => this.updateOpeningField('jobTitle', value)}
                    required
                    errorText={`this field is required`}
                  />
                  <TextField
                    id="floating-center-title"
                    className="md-cell md-cell--12"
                    label="Job Description"
                    lineDirection="left"
                    placeholder="Add Job Description"
                    defaultValue={opening.jobDescription || undefined}
                    onChange={value => this.updateOpeningField('jobDescription', value)}
                    required
                    errorText={`this field is required`}
                  />
                  <TextField
                    id="floating-center-title"
                    className="md-cell md-cell--12"
                    label="Company"
                    lineDirection="left"
                    placeholder="Add company name"
                    defaultValue={opening.company || undefined}
                    onChange={value => this.updateOpeningField('company', value)}
                    required
                    errorText={`this field is required`}
                  />
                  <TextField
                    id="floating-center-title"
                    className="md-cell md-cell--12"
                    label="Max Salary Range"
                    lineDirection="left"
                    placeholder="Add Max Salary Range"
                    defaultValue={opening.maxSalaryRange || undefined}
                    onChange={value => this.updateOpeningField('maxSalaryRange', value)}
                    required
                    errorText={`this field is required`}
                  />
                  <Select
                    defaultValue={undefined}
                    label="Steps"
                    required={false}
                    placeholder="Select a Step"
                    searchPlaceholder="Search by Steps"
                    onChange={value => this.selectStep(value)}
                    menuItems={
                      filteredSteps && filteredSteps.length ? filteredSteps.map(step => ({ value: step.id, label: step.name })) : []
                    }
                  />
                  <List>
                    {opening.steps.map(stepId => {
                      const step = steps.find(step => step.id === stepId);
                      return step ? (
                        <ListItem key={step.id} primaryText={step.name} renderChildrenOutside>
                          <Button icon onClick={() => this.deleteStep(step.id)}>
                            <FontIcon>delete</FontIcon>
                          </Button>
                        </ListItem>
                      ) : (
                        ''
                      );
                    })}
                  </List>
                  <Select
                    defaultValue={opening.status}
                    label="Opening Status"
                    placeholder="Select a Status"
                    onChange={value => this.updateOpeningField('status', value)}
                    menuItems={this.openingStatus.map(status => ({ value: status, label: status }))}
                  />
                  {opening.applications && opening.applications.length ? (
                    <Fragment>
                      <h6 className="md-subheading-1">Applications (Read Only)</h6>
                      <ul>
                        {opening.applications.map(applicationId => {
                          const application = applications.find(application => application.id === applicationId);
                          return application ? (
                            <li key={application.id} className="md-body-1">
                              {application.candidate.name}
                            </li>
                          ) : (
                            ''
                          );
                        })}
                      </ul>
                    </Fragment>
                  ) : (
                    ''
                  )}
                </Fragment>
              );
            }}
          </Query>
        </DialogContainer>
      </div>
    );
  }
}

const applicationAndStepsQuery = gql`
  {
    steps {
      id
      name
    }
    applications {
      id
      candidate {
        name
      }
    }
  }
`;

export default OpeningDialog;

OpeningDialog.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  openingToEdit: PropTypes.object.isRequired,
  hideModal: PropTypes.func.isRequired,
  createUpdateMutation: PropTypes.func.isRequired
};
