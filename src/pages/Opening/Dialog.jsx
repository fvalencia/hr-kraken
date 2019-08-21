import { gql } from 'apollo-boost';
import React, { PureComponent, Fragment } from 'react';
import { Query } from 'react-apollo';
import { Button, DialogContainer, FontIcon, List, ListItem, TextField } from 'react-md';
import Select from '../../components/Select';
import './Dialog.scss';

class OpeningDialog extends PureComponent {
  emptyOpening = {
    id: null,
    jobTitle: '',
    jobDescription: '',
    company: '',
    maxSalaryRange: '',
    status: '',
    steps: []
  };
  state = {
    visible: false,
    opening: this.emptyOpening
  };

  show = () => {
    const openingValue = this.props.opening;
    this.setState({
      visible: true,
      opening: openingValue
    });
  };

  hide = () => {
    this.setState({
      visible: false,
      opening: this.emptyOpening
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

  render() {
    const visible = this.state.visible;
    const opening = this.state.opening;

    return (
      <div>
        <DialogContainer
          className="opening-dialog"
          id="simple-list-dialog"
          focusOnMount={false}
          visible={visible}
          title={opening.id ? 'Edit Opening' : 'New Opening'}
          onHide={this.hide}
        >
          <Query query={applicationAndStepsQuery}>
            {({ data, loading, error }) => {
              if (loading) return <p>Loading…</p>;
              if (error) return <p>Something went wrong</p>;
              const { steps } = data;
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
                </Fragment>
                //   jobDescription
                //   company
                //   maxSalaryRange
                //   status
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
  }
`;

export default OpeningDialog;
