import { gql } from 'apollo-boost';
import React, { PureComponent, Fragment } from 'react';
import { Query } from 'react-apollo';
import { DialogContainer, TextField } from 'react-md';
import Select from '../../components/Select';

class OpeningDialog extends PureComponent {
  state = { visible: false };

  show = () => {
    this.setState({ visible: true });
  };

  hide = () => {
    this.setState({ visible: false });
  };

  componentDidUpdate(prevProps) {
    if (this.props.showDialog !== prevProps.showDialog) {
      this.props.showDialog ? this.show() : this.hide();
    }
  }

  render() {
    const { visible } = this.state;
    const opening = this.props.opening;

    return (
      <div>
        <DialogContainer
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
                    defaultValue={opening.step || undefined}
                    label="Steps"
                    placeholder="Select a Step"
                    searchPlaceholder="Search by Steps"
                    onChange={value => this.onChange('step', value)}
                    menuItems={steps ? steps.map(step => ({ value: step.id, label: step.name })) : []}
                  />
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
