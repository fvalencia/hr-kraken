import React, { PureComponent, Fragment } from 'react';
import { Button, DialogContainer, DatePicker, TextField, FontIcon, SelectionControlGroup } from 'react-md';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import './styles.scss';
import Select from '../../components/Select';
import { RESULTS } from '../../constants/result';
import { FORMAT_OPTIONS } from '../../constants/dateFormat';
class ApplicationDialog extends PureComponent {
  state = {
    visible: this.props.application ? true : false,
    application: this.props.application
      ? { ...this.props.application, candidate: this.props.application.candidate.id, opening: this.props.application.opening.id }
      : {
          startDate: null,
          endDate: null,
          candidate: null,
          opening: null,
          feedback: null,
          responsible: null,
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
    this.setState({ application: { ...this.state.application, [key]: value } });
  };

  onSubmit = mutationFn => {
    const isCreate = this.props.type === 'create';
    const { id, startDate, responsible, candidate, opening, endDate, result, feedback } = this.state.application;
    const where = !isCreate ? { id } : undefined;
    const data = isCreate
      ? {
          startDate: startDate.toISOString(),
          responsible: responsible,
          candidate: { connect: { id: candidate } },
          opening: { connect: { id: opening } }
        }
      : {
          endDate: endDate.toISOString(),
          result,
          feedback
        };
    mutationFn({
      variables: {
        data,
        where
      }
    });
    this.hide();
  };

  render() {
    const { visible, application } = this.state;
    const { candidate, opening, startDate, responsible, result = 'AVERAGE', feedback, endDate } = application;
    const isCreate = this.props.type === 'create';
    const disabled = !candidate || !opening || !startDate || !responsible || (!isCreate && (!feedback || !endDate));
    const title = isCreate ? 'Add' : 'Assess';
    const buttonText = isCreate ? 'Add' : 'Send';
    const radioControls = RESULTS.map(({ label, value, icon }) => ({
      label,
      value,
      checkedRadioIcon: <FontIcon>{icon}</FontIcon>,
      uncheckedRadioIcon: <FontIcon>{icon}</FontIcon>,
      className: result === value ? 'selected' : ''
    }));
    return (
      <div>
        <Button floating primary className="add-button" onClick={this.show}>
          add
        </Button>
        <Mutation mutation={isCreate ? ADD_APPLICATION : UPDATE_APPLICATION} onCompleted={() => this.props.onCompleted(isCreate)}>
          {mutationFn => (
            <Fragment>
              <DialogContainer
                id="simple-list-dialog"
                visible={visible}
                title={`${title} Application`}
                onHide={this.hide}
                actions={[
                  { secondary: true, children: 'Cancel', onClick: this.hide, type: 'button' },
                  { secondary: false, children: buttonText, onClick: () => this.onSubmit(mutationFn), disabled, type: 'submit' }
                ]}
                className="application-dialog"
              >
                <div className="md-grid">
                  <DatePicker
                    id="startDate"
                    label="Star Date"
                    className={!isCreate ? 'md-cell md-cell--6' : 'md-cell md-cell--12'}
                    portal={true}
                    lastChild={true}
                    disableScrollLocking={true}
                    defaultValue={application.startDate ? new Date(application.startDate) : undefined}
                    renderNode={document.body}
                    required
                    onChange={(_, dateObject) => this.onChange('startDate', dateObject)}
                    errorText={`this field is required`}
                    disabled={!isCreate ? true : undefined}
                    formatOptions={FORMAT_OPTIONS}
                    locales="en-US"
                  />
                  {!isCreate ? (
                    <DatePicker
                      id="endDate"
                      label="End Date"
                      className="md-cell md-cell--6"
                      portal={true}
                      lastChild={true}
                      disableScrollLocking={true}
                      defaultValue={application.endDate ? new Date(application.endDate) : undefined}
                      renderNode={document.body}
                      required
                      onChange={(_, dateObject) => this.onChange('endDate', dateObject)}
                      errorText={`this field is required`}
                      formatOptions={FORMAT_OPTIONS}
                      locales="en-US"
                    />
                  ) : (
                    ''
                  )}
                  <TextField
                    id="responsible"
                    className="md-cell md-cell--12"
                    label="Responsible"
                    lineDirection="left"
                    placeholder="Add responsible name"
                    defaultValue={application.responsible || undefined}
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
                            disabled={!isCreate ? true : undefined}
                          />
                        </Fragment>
                      );
                    }}
                  </Query>
                  {!isCreate ? (
                    <SelectionControlGroup
                      id="result-radios"
                      name="result-radio"
                      label="Result"
                      type="radio"
                      controls={radioControls}
                      className="hrk-result-selection"
                      labelClassName="md-text--secondary"
                      inline={true}
                      defaultValue={'AVERAGE'}
                      onChange={value => this.onChange('result', value)}
                    />
                  ) : (
                    ''
                  )}
                  {!isCreate ? (
                    <TextField
                      id="feedback"
                      className="md-cell md-cell--12"
                      label="Feedback"
                      lineDirection="left"
                      rows={3}
                      placeholder="Add feedback here."
                      defaultValue={application.feedback || undefined}
                      required
                      onChange={value => this.onChange('feedback', value)}
                      errorText={`this field is required`}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </DialogContainer>
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
  mutation AddApplication($data: ApplicationCreateInput!) {
    createApplication(data: $data) {
      id
    }
  }
`;

const UPDATE_APPLICATION = gql`
  mutation UpdateApplication($data: ApplicationUpdateInput!, $where: ApplicationWhereUniqueInput!) {
    updateApplication(data: $data, where: $where) {
      id
    }
  }
`;

export default ApplicationDialog;
