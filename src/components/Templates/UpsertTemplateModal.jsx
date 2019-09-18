import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { DialogContainer, TextField, Snackbar, Autocomplete } from 'react-md';

import StepChip from './StepChip';

const getInitialState = () => ({
  template: {
    name: null,
    steps: [] // ? can be null?
  },
  isUpdating: false,
  toasts: []
});

export default class UpsertTemplateModal extends Component {
  state = getInitialState();

  addToast = (text, action, autohide = true) => {
    this.setState(state => {
      const toasts = state.toasts.slice();
      toasts.push({ text, action });
      return { toasts, autohide };
    });
  };

  updateTemplateField = (key, value) => {
    this.setState({ template: { ...this.state.template, [key]: value } });
  };

  saveTemplate = upsertTemplateFn => {
    const { template, isUpdating } = this.state;
    let templateToUpsert, where;
    const stepsIds = template.steps.map(s => ({ id: s.id }));

    templateToUpsert = {
      ...template,
      steps: {
        create: [] // * we don't create steps while template creation, we used the existing ones
      }
    };

    // Editing template
    if (isUpdating) {
      where = { id: templateToUpsert.id };

      // Remove unaccepted props in template object to update
      delete templateToUpsert['__typename'];
      delete templateToUpsert['id'];
    } else {
      where = { id: '' };
    }

    upsertTemplateFn({
      variables: {
        where,
        create: {
          ...templateToUpsert,
          steps: { ...templateToUpsert.steps, connect: stepsIds }
        },
        update: {
          ...templateToUpsert,
          steps: { ...templateToUpsert.steps, set: stepsIds }
        }
      }
    });
  };

  // * Can received data of new template added
  upsertTemplateComplete = () => {
    if (this.props.template) {
      this.addToast('Template Updated Successfully!');
    } else {
      this.addToast('New template Added Successfully!');
    }

    if (this.props.afterUpsertSuccess) {
      this.props.afterUpsertSuccess();
    }

    this.hideAndResetModal();
  };

  hideAndResetModal = () => {
    this.setState(getInitialState());
    this.props.onHide();
  };

  dismissToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  };

  showErrorOnTemplateCreation = () => {
    // TODO: give feedback about the error and if it's something in our side then allow to RETRY
    this.addToast('Something happened, check the info and try again...');
  };

  removeStep = step => {
    const { template } = this.state;
    const updatedTemplate = {
      ...template,
      steps: template.steps.filter(s => s.id !== step.id)
    };
    this.setState({
      template: updatedTemplate
    });
  };

  addStep = (_, suggestionIndex, matches) => {
    const newStep = matches[suggestionIndex];
    const { template } = this.state;
    const updatedTemplate = {
      ...template,
      steps: [...template.steps, newStep]
    };
    this.setState({
      template: updatedTemplate
    });
    console.log('template in state', template);
    console.log('updated template', updatedTemplate);
  };

  componentDidUpdate(prevProps) {
    // * it's important to always compare props before performing an action
    if (!prevProps.template && !!this.props.template) {
      this.setState({
        template: this.props.template,
        isUpdating: true
      });
    }
  }

  render() {
    const { visible, allSteps } = this.props;
    const { toasts, isUpdating, template } = this.state;
    const { name, steps } = template;
    let modalTitle;

    if (isUpdating) {
      modalTitle = 'Edit Template';
    } else {
      modalTitle = 'New Template';
    }

    // TODO: disable conditionally save button when editing a template
    const saveButtonDisabled = !name || !steps.length;

    const stepsChips = template.steps.map(step => (
      <StepChip key={step.id} step={step} removeStep={this.removeStep} />
    ));
    // TODO: all steps but steps already in template
    const tptStepsIds = template.steps.map(step => step.id);
    const filteredSteps = allSteps.filter(
      s => tptStepsIds.indexOf(s.id) === -1
    );

    return (
      <Mutation
        mutation={UPSERT_TEMPLATE}
        onCompleted={this.upsertTemplateComplete}
        onError={this.showErrorOnTemplateCreation}
      >
        {upsertTemplate => (
          <Fragment>
            <DialogContainer
              id="new-template-dialog"
              visible={visible}
              onHide={this.hideAndResetModal}
              actions={[
                {
                  secondary: true,
                  children: 'Cancel',
                  onClick: this.hideAndResetModal
                },
                {
                  secondary: false,
                  children: 'Save',
                  onClick: () => this.saveTemplate(upsertTemplate),
                  type: 'submit',
                  disabled: saveButtonDisabled
                }
              ]}
              title={modalTitle}
            >
              <TextField
                id="name"
                label="Name"
                placeholder="Template name..."
                defaultValue={name}
                onChange={value => this.updateTemplateField('name', value)}
                required
              />
              <CSSTransitionGroup
                component="div"
                transitionName="opacity"
                transitionEnterTimeout={150}
                transitionLeaveTimeout={150}
              >
                {stepsChips}
                <Autocomplete
                  id="steps-autocomplete"
                  label="Select some steps"
                  data={filteredSteps}
                  dataLabel="name"
                  dataValue="name"
                  onAutocomplete={this.addStep}
                  clearOnAutocomplete
                  deleteKeys="id"
                />
              </CSSTransitionGroup>
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

const UPSERT_TEMPLATE = gql`
  mutation UpsertTemplate(
    $where: TemplateStepWhereUniqueInput!
    $create: TemplateStepCreateInput!
    $update: TemplateStepUpdateInput!
  ) {
    upsertTemplateStep(where: $where, create: $create, update: $update) {
      id
    }
  }
`;

UpsertTemplateModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  template: PropTypes.object,
  afterUpsertSuccess: PropTypes.func,
  allSteps: PropTypes.array.isRequired
};
