import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { DialogContainer, TextField, SelectField, Snackbar } from 'react-md';

export default class UpsertCandidateModal extends Component {
  state = {
    candidate: {
      name: null,
      email: null,
      phone: null,
      skypeId: null,
      title: null,
      seniority: null,
      yearsOfExperience: null,
      salaryExpectation: null
    },
    toasts: []
  };

  // ? Is there a way to pull these values from the ones defined in graphql?
  seniorityLevels = ['JUNIOR', 'MIDDLE', 'SENIOR'];

  addToast = (text, action, autohide = true) => {
    this.setState(state => {
      const toasts = state.toasts.slice();
      toasts.push({ text, action });
      return { toasts, autohide };
    });
  };

  updateCandidateField = (key, value) => {
    this.setState({ candidate: { ...this.state.candidate, [key]: value } });
  };

  saveCandidate = upsertCandidateFn => {
    const { candidate } = this.state;
    let candidateToUpsert, where;

    // Editing candidate
    if (this.props.entity) {
      // clear keys with null values (as they haven't change with the form, they're null in the state)
      for (const key in candidate) {
        if (candidate.hasOwnProperty(key)) {
          if (candidate[key] === null) {
            delete candidate[key];
          }
        }
      }

      candidateToUpsert = { ...this.props.entity, ...candidate };
      where = { id: candidateToUpsert.id };

      // Remove unaccepted props in candidate object to update
      delete candidateToUpsert['__typename'];
      delete candidateToUpsert['id'];
    } else {
      candidateToUpsert = candidate;
      candidateToUpsert.status = 'AVAILABLE'; // * AVAILABLE on creation by default
      where = { id: '' };
    }

    upsertCandidateFn({
      variables: { where, create: candidateToUpsert, update: candidateToUpsert }
    });
  };

  // * Can received data of new candidate added
  upsertCandidateComplete = () => {
    this.props.onHide();
    if (this.props.entity) {
      this.addToast('Candidate Updated Successfully!');
    } else {
      this.addToast('New Candidate Added Successfully!');
    }

    if (this.props.afterUpsertSuccess) {
      this.props.afterUpsertSuccess();
    }
  };

  dismissToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  };

  showErrorOnCandidateCreation = () => {
    // TODO: give feedback about the error and if it's something in our side then allow to RETRY
    this.addToast('Something happened, check the info and try again...');
  };

  render() {
    const { visible, onHide } = this.props;
    const { toasts } = this.state;

    let modalTitle = 'New Candidate';
    let { candidate } = this.state;
    if (this.props.entity) {
      modalTitle = 'Edit Candidate';
      candidate = this.props.entity;
    }
    const {
      name,
      email,
      phone,
      skypeId,
      title,
      seniority,
      yearsOfExperience,
      salaryExpectation
    } = candidate;
    // TODO: disable conditionally save button when editing a candidate
    const saveButtonDisabled = !name || !email || !title || !seniority;

    return (
      <Mutation
        mutation={UPSERT_CANDIDATE}
        onCompleted={this.upsertCandidateComplete}
        onError={this.showErrorOnCandidateCreation}
      >
        {upsertCandidate => (
          <Fragment>
            <DialogContainer
              id="new-candidate-dialog"
              visible={visible}
              onHide={onHide}
              actions={[
                { secondary: true, children: 'Cancel', onClick: onHide },
                {
                  secondary: false,
                  children: 'Save',
                  onClick: () => this.saveCandidate(upsertCandidate),
                  type: 'submit',
                  disabled: saveButtonDisabled
                }
              ]}
              title={modalTitle}
            >
              <TextField
                id="name"
                label="Name"
                placeholder="Full name..."
                defaultValue={name}
                onChange={value => this.updateCandidateField('name', value)}
                required
              />
              <TextField
                id="email"
                label="Email"
                placeholder="example@email.com"
                defaultValue={email}
                onChange={value => this.updateCandidateField('email', value)}
                required
              />
              <TextField
                id="phone"
                label="Phone"
                placeholder="+57 1234567890"
                defaultValue={phone}
                onChange={value => this.updateCandidateField('phone', value)}
              />
              <TextField
                id="skype"
                label="Skype ID"
                placeholder="mySkype"
                defaultValue={skypeId}
                onChange={value => this.updateCandidateField('skypeId', value)}
              />
              <TextField
                id="title"
                label="Title"
                placeholder="FrontEnd Engineer..."
                defaultValue={title}
                onChange={value => this.updateCandidateField('title', value)}
                required
              />
              <SelectField
                id="seniority"
                label="Seniority"
                placeholder="Middle"
                menuItems={this.seniorityLevels}
                defaultValue={seniority ? seniority : undefined}
                simplifiedMenu={true}
                fullWidth={true}
                onChange={value =>
                  this.updateCandidateField('seniority', value)
                }
                required
              />
              <TextField
                id="years-of-experience"
                label="Years of experience"
                placeholder="3"
                defaultValue={yearsOfExperience}
                type="number"
                onChange={value =>
                  this.updateCandidateField('yearsOfExperience', +value)
                }
              />
              <TextField
                id="salary-expectation"
                label="Salary Expectation"
                placeholder="3000000"
                defaultValue={salaryExpectation}
                type="number"
                onChange={value =>
                  this.updateCandidateField('salaryExpectation', +value)
                }
              />
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

const UPSERT_CANDIDATE = gql`
  mutation UpsertCandidate(
    $where: CandidateWhereUniqueInput!
    $create: CandidateCreateInput!
    $update: CandidateUpdateInput!
  ) {
    upsertCandidate(where: $where, create: $create, update: $update) {
      id
    }
  }
`;

// TODO: specify entity structure
UpsertCandidateModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  entity: PropTypes.object,
  afterUpsertSuccess: PropTypes.func
};
