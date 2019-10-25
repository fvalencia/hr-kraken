import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardText,
  CardTitle,
  FontIcon,
  TextField
} from 'react-md';

import Empty from '../Empty';
import ConfirmDialog from '../ConfirmDialog';
import UpsertStepModal from './UpsertStepModal';
import './StepsCards.scss';

export default class StepsCards extends Component {
  state = {
    alertVisible: false,
    stepToDelete: null,
    upsertStepModalVisible: false,
    stepToEdit: null,
    textSearch: ''
  };

  editStep = step => {
    return () => {
      this.setState({
        stepToEdit: step,
        upsertStepModalVisible: true
      });
    };
  };

  closeUpsertStepModal = () => {
    this.setState({ upsertStepModalVisible: false });
  };

  deleteStep = step => {
    return () => {
      this.setState({ stepToDelete: step, alertVisible: true });
    };
  };

  onAlertEvent = (event, deleteStepFn) => {
    if (event === 'confirm') {
      const { stepToDelete } = this.state;
      deleteStepFn({
        variables: {
          where: {
            id: stepToDelete.id
          }
        }
      });
    }

    this.setState({ stepToDelete: null, alertVisible: false });
  };

  deleteStepCompleted = () => {
    // TODO: show toast message and emit so the table re-fetch the data
    console.warn('Delete step successfully, show message');
    this.props.refetchFn();
  };

  deleteStepError = e => {
    // TODO: show toast message with the error OR prevent allowing to delete the step if has current applications
    console.warn('Delete step ERROR, show message', e);
  };

  onTextChange = text => {
    this.setState({ textSearch: text });
  };

  render() {
    const {
      alertVisible,
      upsertStepModalVisible,
      stepToEdit,
      textSearch
    } = this.state;

    const stepsFiltered = textSearch.length
      ? this.props.steps.filter(s =>
          s.name.toLowerCase().includes(textSearch.toLowerCase())
        )
      : this.props.steps;

    return (
      <Fragment>
        <div className="md-grid right">
          <TextField
            id="search-field"
            leftIcon={<FontIcon>search</FontIcon>}
            lineDirection="left"
            placeholder="Search by Text"
            className="md-cell md-cell--bottom"
            onChange={this.onTextChange}
          />
        </div>
        {stepsFiltered.length ? (
          <Fragment>
            <div className="steps-container">
              {stepsFiltered.map(step => (
                <Card className="step-card" key={step.id}>
                  <CardTitle title="">
                    <FontIcon>{step.icon}</FontIcon>
                  </CardTitle>
                  <CardText>
                    <h4>{step.name}</h4>
                  </CardText>
                  <CardActions className="md-card-actions">
                    <Button icon primary onClick={this.editStep(step)}>
                      edit
                    </Button>
                    <Button icon secondary onClick={this.deleteStep(step)}>
                      delete_forever
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </div>
            <Mutation
              mutation={DELETE_STEP}
              onCompleted={this.deleteStepCompleted}
              onError={this.deleteStepError}
            >
              {deleteStep => (
                <ConfirmDialog
                  visible={alertVisible}
                  title="Alert"
                  message="Do you want to delete this step?"
                  onEvent={e => this.onAlertEvent(e, deleteStep)}
                />
              )}
            </Mutation>
            <UpsertStepModal
              visible={upsertStepModalVisible}
              onHide={this.closeUpsertStepModal}
              step={stepToEdit}
              afterUpsertSuccess={this.props.refetchFn}
            />
          </Fragment>
        ) : (
          <div>
            <Empty>ups we didn't find any results</Empty>
          </div>
        )}
      </Fragment>
    );
  }
}

const DELETE_STEP = gql`
  mutation DeleteStep($where: StepWhereUniqueInput!) {
    deleteStep(where: $where) {
      id
    }
  }
`;

StepsCards.propTypes = {
  steps: PropTypes.array.isRequired,
  refetchFn: PropTypes.func
};
