import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { DialogContainer, TextField, Snackbar } from 'react-md';

export default class UpsertStepModal extends Component {
  state = {
    step: {
      name: null
      // icon: null
    },
    toasts: []
  };

  addToast = (text, action, autohide = true) => {
    this.setState(state => {
      const toasts = state.toasts.slice();
      toasts.push({ text, action });
      return { toasts, autohide };
    });
  };

  updateStepField = (key, value) => {
    this.setState({ step: { ...this.state.step, [key]: value } });
  };

  saveStep = upsertStepFn => {
    const { step } = this.state;
    let stepToUpsert, where;

    // Editing step
    if (this.props.step) {
      // clear keys with null values (as they haven't change with the form, they're null in the state)
      for (const key in step) {
        if (step.hasOwnProperty(key)) {
          if (step[key] === null) {
            delete step[key];
          }
        }
      }

      stepToUpsert = { ...this.props.step, ...step };
      where = { id: stepToUpsert.id };

      // Remove unaccepted props in step object to update
      delete stepToUpsert['__typename'];
      delete stepToUpsert['id'];
    } else {
      stepToUpsert = step;
      where = { id: '' };
    }

    upsertStepFn({
      variables: { where, create: stepToUpsert, update: stepToUpsert }
    });
  };

  // * Can received data of new step added
  upsertStepComplete = () => {
    this.props.onHide();
    if (this.props.step) {
      this.addToast('Step Updated Successfully!');
    } else {
      this.addToast('New Step Added Successfully!');
    }

    if (this.props.afterUpsertSuccess) {
      this.props.afterUpsertSuccess();
    }
  };

  dismissToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  };

  showErrorOnStepCreation = () => {
    // TODO: give feedback about the error and if it's something in our side then allow to RETRY
    this.addToast('Something happened, check the info and try again...');
  };

  render() {
    const { visible, onHide } = this.props;
    const { toasts } = this.state;

    let modalTitle = 'New Step';
    let { step } = this.state;
    if (this.props.step) {
      modalTitle = 'Edit Step';
      step = this.props.step;
    }
    const {
      name
      // icon
    } = step;
    // TODO: disable conditionally save button when editing a step
    const saveButtonDisabled = !name; // || !icon;

    return (
      <Mutation
        mutation={UPSERT_Step}
        onCompleted={this.upsertStepComplete}
        onError={this.showErrorOnStepCreation}
      >
        {upsertStep => (
          <Fragment>
            <DialogContainer
              id="new-step-dialog"
              visible={visible}
              onHide={onHide}
              actions={[
                { secondary: true, children: 'Cancel', onClick: onHide },
                {
                  secondary: false,
                  children: 'Save',
                  onClick: () => this.saveStep(upsertStep),
                  type: 'submit',
                  disabled: saveButtonDisabled
                }
              ]}
              title={modalTitle}
            >
              <TextField
                id="name"
                label="Name"
                placeholder="Step name..."
                defaultValue={name}
                onChange={value => this.updateStepField('name', value)}
                required
              />
              {/* TODO: Custom select with icons list */}
            </DialogContainer>
            <Snackbar
              id="error-message"
              toasts={toasts}
              autohide={true}
              onDismiss={this.dismissToast}
            />
          </Fragment>
        )}
      </Mutation>
    );
  }
}

const UPSERT_Step = gql`
  mutation UpsertStep(
    $where: StepWhereUniqueInput!
    $create: StepCreateInput!
    $update: StepUpdateInput!
  ) {
    upsertStep(where: $where, create: $create, update: $update) {
      id
    }
  }
`;

UpsertStepModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  step: PropTypes.object,
  afterUpsertSuccess: PropTypes.func
};
