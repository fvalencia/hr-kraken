import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import { DialogContainer, TextField, SelectField, Snackbar } from 'react-md';

export default class NewCandidate extends Component {
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

  saveCandidate = addCandidateFn => {
    const { candidate } = this.state;
    candidate.status = 'AVAILABLE'; // * AVAILABLE on creation by default

    addCandidateFn({ variables: { candidateData: candidate } });
  };

  // * Can received data of new candidate added
  addCandidateComplete = () => {
    this.props.onHide();
    this.addToast('New Candidate Added Successfully!');
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
    const { toasts, candidate } = this.state;
    // ? Is there a way to pull these values from the ones defined in graphql?
    const SENIORITY = ['JUNIOR', 'MIDDLE', 'SENIOR'];
    const {name, email, title, seniority} = candidate;
    const saveButtonDisabled = !name || !email || !title || !seniority;

    return (
      <Mutation
        mutation={ADD_CANDIDATE}
        onCompleted={this.addCandidateComplete}
        onError={this.showErrorOnCandidateCreation}
      >
        {addCandidate => (
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
                  onClick: () => this.saveCandidate(addCandidate),
                  type: 'submit',
                  disabled: saveButtonDisabled
                }
              ]}
              title="New Candidate"
            >
              <TextField
                id="name"
                label="Name"
                placeholder="Full name..."
                onChange={value => this.updateCandidateField('name', value)}
                required
              />
              <TextField
                id="email"
                label="Email"
                placeholder="example@email.com"
                onChange={value => this.updateCandidateField('email', value)}
                required
              />
              <TextField
                id="phone"
                label="Phone"
                placeholder="+57 1234567890"
                onChange={value => this.updateCandidateField('phone', value)}
              />
              <TextField
                id="skype"
                label="Skype ID"
                placeholder="mySkype"
                onChange={value => this.updateCandidateField('skypeId', value)}
              />
              <TextField
                id="title"
                label="Title"
                placeholder="FrontEnd Engineer..."
                onChange={value => this.updateCandidateField('title', value)}
                required
              />
              <SelectField
                id="seniority"
                label="Seniority"
                placeholder="Middle"
                menuItems={SENIORITY}
                simplifiedMenu={true}
                onChange={value =>
                  this.updateCandidateField('seniority', value)
                }
                required
              />
              <TextField
                id="years-of-experience"
                label="Years of experience"
                placeholder="3"
                type="number"
                onChange={value =>
                  this.updateCandidateField('yearsOfExperience', +value)
                }
              />
              <TextField
                id="salary-expectation"
                label="Salary Expectation"
                placeholder="3000000"
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

const ADD_CANDIDATE = gql`
  mutation AddCandidate($candidateData: CandidateCreateInput!) {
    createCandidate(data: $candidateData) {
      id
    }
  }
`;

NewCandidate.propTypes = {
  visible: PropTypes.bool.isRequired
};
