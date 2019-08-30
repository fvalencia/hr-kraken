import { gql } from 'apollo-boost';
import React, { PureComponent, Fragment } from 'react';
import { Query } from 'react-apollo';
import { Button, DialogContainer, FontIcon, List, ListItem, TextField } from 'react-md';
import Select from '../../components/Select';
import Loading from '../../components/Loading';
import './Dialog.scss';

class OpeningDialog extends PureComponent {
  state = {
    visible: false,
    opening: { id: null, jobTitle: '', jobDescription: '', company: '', maxSalaryRange: '', status: '', steps: [] }
  };
  buttonText = 'save';

  show = () => {
    const openingValue = this.props.opening;
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

  componentDidUpdate(prevProps) {
    if (this.props.showDialog !== prevProps.showDialog) {
      this.props.showDialog ? this.show() : this.hide();
    }
  }

  selectStep(step) {
    const currentOpening = this.state.opening;
    currentOpening.steps.push(step);
    this.setState({
      opening: currentOpening
    });
  }

  onSubmit() {}

  render() {
    const visible = this.state.visible;
    const opening = this.state.opening;
    const disabled = true;
    const actions = [
      { secondary: true, children: 'Cancel', onClick: this.props.hideModal, type: 'button' },
      { secondary: false, children: this.buttonText, onClick: () => this.onSubmit(), disabled, type: 'submit' }
    ];

    return (
      <div>
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
              if (loading) return <Loading />;
              if (error) return <p>Something went wrong</p>;
              const { steps, applications } = data;
              return (
                <Fragment>
                  <TextField
                    id="floating-center-title"
                    className="md-cell md-cell--12"
                    label="Job Title"
                    lineDirection="left"
                    placeholder="Add Job Title"
                    defaultValue={opening.jobTitle || undefined}
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
                    required
                    errorText={`this field is required`}
                  />
                  <TextField
                    id="floating-center-title"
                    className="md-cell md-cell--12"
                    label="Company"
                    lineDirection="left"
                    placeholder="Add Max Salary Range"
                    defaultValue={opening.maxSalaryRange || undefined}
                    required
                    errorText={`this field is required`}
                  />
                  <Select
                    defaultValue={undefined}
                    label="Steps"
                    placeholder="Select a Step"
                    searchPlaceholder="Search by Steps"
                    onChange={value => this.selectStep(value)}
                    menuItems={steps ? steps.map(step => ({ value: step.id, label: step.name })) : []}
                  />
                  <List>
                    {opening.steps.map(stepId => {
                      const step = steps.find(step => step.id === stepId);
                      return (
                        <ListItem key={step.id} primaryText={step.name} renderChildrenOutside>
                          <Button icon>
                            <FontIcon>delete</FontIcon>
                          </Button>
                        </ListItem>
                      );
                    })}
                  </List>
                  <Select
                    defaultValue={undefined}
                    label="Applications"
                    placeholder="Select a Application"
                    searchPlaceholder="Search by Application"
                    onChange={value => this.selectStep(value)}
                    menuItems={applications ? applications.map(application => ({ value: application.id, label: application.name })) : []}
                  />
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
    application {
      id
      name
    }
  }
`;

export default OpeningDialog;
