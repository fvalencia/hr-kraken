import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import PropTypes from 'prop-types';
import {
  DataTable,
  FontIcon,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TextField
} from 'react-md';

import ColumnKebabMenu from '../shared/ColumnKebabMenu';
import ConfirmDialog from '../ConfirmDialog';
import Empty from '../Empty';
import UpsertTemplateModal from './UpsertTemplateModal';

export default class TemplatesTable extends Component {
  state = {
    alertVisible: false,
    templateToDelete: null,
    upsertTemplateModalVisible: false,
    templateToEdit: null,
    textSearch: ''
  };

  editTemplate = candidate => {
    return () => {
      this.setState({
        templateToEdit: candidate,
        upsertTemplateModalVisible: true
      });
    };
  };

  closeUpsertTemplateModal = () => {
    this.setState({ upsertTemplateModalVisible: false, templateToEdit: null });
  };

  deleteTemplate = candidate => {
    return () => {
      this.setState({ templateToDelete: candidate, alertVisible: true });
    };
  };

  onAlertEvent = (event, deleteTemplateFn) => {
    if (event === 'confirm') {
      const { templateToDelete } = this.state;
      deleteTemplateFn({
        variables: {
          where: {
            id: templateToDelete.id
          }
        }
      });
    }

    this.setState({ templateToDelete: null, alertVisible: false });
  };

  deleteTemplateCompleted = () => {
    // TODO: show toast message and emit so the table re-fetch the data
    console.warn('Delete candidate successfully, show message');
    this.props.refetchFn();
  };

  deleteTemplateError = e => {
    // TODO: show toast message with the error OR prevent allowing to delete the candidate if has current applications
    console.warn('Delete candidate ERROR, show message', e);
  };

  onTextChange = text => {
    this.setState({ textSearch: text });
  };

  render() {
    const {
      alertVisible,
      upsertTemplateModalVisible,
      templateToEdit,
      textSearch
    } = this.state;

    const menuItems = [
      {
        leftIcon: <FontIcon>edit</FontIcon>,
        primaryText: 'Edit',
        onClick: this.editTemplate
      },
      {
        leftIcon: <FontIcon>delete_forever</FontIcon>,
        primaryText: 'Delete',
        onClick: this.deleteTemplate
      }
    ];

    const templatesFiltered = textSearch.length
      ? this.props.templates.filter(c =>
          c.name.toLowerCase().includes(textSearch.toLowerCase())
        )
      : this.props.templates;

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
        {templatesFiltered.length ? (
          <Fragment>
            <DataTable plain>
              <TableHeader>
                <TableRow>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Steps</TableColumn>
                  <TableColumn />
                </TableRow>
              </TableHeader>
              <TableBody>
                {templatesFiltered.map(template => (
                  <TableRow key={template.id}>
                    <TableColumn>{template.name}</TableColumn>
                    <TableColumn>{template.steps.length}</TableColumn>
                    <ColumnKebabMenu
                      menuItems={menuItems.map(mi => ({
                        ...mi,
                        onClick: mi.onClick(template) // update each function with the correspondent template
                      }))}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
            <Mutation
              mutation={DELETE_TEMPLATE}
              onCompleted={this.deleteTemplateCompleted}
              onError={this.deleteTemplateError}
            >
              {deleteTemplate => (
                <ConfirmDialog
                  visible={alertVisible}
                  title="Alert"
                  message="Do you want to delete this template?"
                  onEvent={e => this.onAlertEvent(e, deleteTemplate)}
                />
              )}
            </Mutation>
            <UpsertTemplateModal
              visible={upsertTemplateModalVisible}
              onHide={this.closeUpsertTemplateModal}
              template={templateToEdit}
              afterUpsertSuccess={this.props.refetchFn}
              allSteps={this.props.allSteps}
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

const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($where: TemplateStepWhereUniqueInput!) {
    deleteTemplateStep(where: $where) {
      id
    }
  }
`;

TemplatesTable.propTypes = {
  templates: PropTypes.array.isRequired,
  refetchFn: PropTypes.func,
  allSteps: PropTypes.array.isRequired
};
