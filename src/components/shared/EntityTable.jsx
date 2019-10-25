import React, { Component, Fragment } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  DataTable,
  FontIcon,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TextField,
  TablePagination
} from 'react-md';

import ColumnKebabMenu from '../shared/ColumnKebabMenu';
import ConfirmDialog from '../../components/ConfirmDialog';
import Empty from '../../components/Empty';

export default class EntityTable extends Component {
  state = {
    alertVisible: false,
    entityToDelete: null,
    upsertEntityModalVisible: false,
    entityToEdit: null,
    textSearch: ''
  };

  editEntity = entity => {
    return () => {
      this.setState({
        entityToEdit: entity,
        upsertEntityModalVisible: true
      });
    };
  };

  closeUpsertEntityModal = () => {
    this.setState({ upsertEntityModalVisible: false });
  };

  deleteEntity = entity => {
    return () => {
      this.setState({ entityToDelete: entity, alertVisible: true });
    };
  };

  onAlertEvent = (event, deleteEntityFn) => {
    if (event === 'confirm') {
      const { entityToDelete } = this.state;
      deleteEntityFn({
        variables: {
          where: {
            id: entityToDelete.id
          }
        }
      });
    }

    this.setState({ entityToDelete: null, alertVisible: false });
  };

  deleteEntityCompleted = () => {
    // TODO: show toast message and emit so the table re-fetch the data
    console.warn(`Delete ${this.props.entityName} successfully, show message`);
    this.props.refetchFn();
  };

  deleteEntityError = e => {
    // TODO: show toast message with the error OR prevent allowing to delete the candidate if has current applications
    console.warn(`Delete ${this.props.entityName} ERROR, show message`, e);
  };

  onTextChange = text => {
    this.setState({ textSearch: text });
  };

  handlePagination = (start, rowsPerPage) => {
    this.props.paginationFn(start, rowsPerPage);
  };

  menuItems = {
    edit: {
      leftIcon: <FontIcon>edit</FontIcon>,
      primaryText: 'Edit',
      onClick: this.editEntity
    },
    delete: {
      leftIcon: <FontIcon className="md-text--error">delete_forever</FontIcon>,
      primaryText: <span className="md-text--error">Delete</span>,
      onClick: this.deleteEntity
    }
  };

  render() {
    const {
      alertVisible,
      upsertEntityModalVisible,
      entityToEdit,
      textSearch
    } = this.state;

    const { columns, actionMenuItem, deleteEntityGQL, searchFn, paginationInfo } = this.props;

    const entitiesFiltered = textSearch.length
      ? this.props.entities.filter(c => searchFn(c, textSearch))
      : this.props.entities;

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
        {entitiesFiltered.length ? (
          <Fragment>
            <DataTable baseId={`table-${this.props.entityName}`}>
              <TableHeader>
                <TableRow selectable={false}>
                  {columns.map((column, idx) => (
                    <TableColumn key={`column-header-${idx}`}>
                      {column.title}
                    </TableColumn>
                  ))}
                  { Array.isArray(actionMenuItem) && actionMenuItem.length ? <TableColumn /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {entitiesFiltered.map(entity => (
                  // TODO: entity must have id property
                  <TableRow key={`entity-row-${entity.id}`} selectable={false}>
                    {columns.map((...[, idx]) => (
                      <TableColumn key={`entity-column-${idx}`}>
                        {Array.isArray(entity[columns[idx].propertyName])
                          ? entity[columns[idx].propertyName].length
                          : entity[columns[idx].propertyName]}
                      </TableColumn>
                    ))}
                    { Array.isArray(actionMenuItem) && actionMenuItem.length ? (
                      <ColumnKebabMenu
                        menuItems={actionMenuItem.map(action => {
                          if (this.menuItems[action.key]) {
                            return ({
                              ...this.menuItems[action.key],
                              onClick: this.menuItems[action.key].onClick(entity) // update each function with the correspondent entity
                            })
                          } else {
                            return ({
                              ...action,
                              onClick: action.onClick(entity),
                              disabled: action.disabled(entity)
                            });
                          }
                        })}
                      />
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
              <TablePagination
                rows={paginationInfo.rows}
                rowsPerPage={paginationInfo.rowsPerPage}
                defaultPage={(paginationInfo.start / paginationInfo.rowsPerPage) + 1}
                rowsPerPageLabel={'Rows per page'}
                onPagination={this.handlePagination}
              />
            </DataTable>
            <Mutation
              mutation={deleteEntityGQL}
              onCompleted={this.deleteEntityCompleted}
              onError={this.deleteEntityError}
            >
              {deleteEntity => (
                <ConfirmDialog
                  visible={alertVisible}
                  title="Alert"
                  message={`Do you want to delete this ${this.props.entityName}?`}
                  onEvent={e => this.onAlertEvent(e, deleteEntity)}
                />
              )}
            </Mutation>
            {this.props.upsertEntityModal ? React.cloneElement(this.props.upsertEntityModal, {
              visible: upsertEntityModalVisible,
              onHide: this.closeUpsertEntityModal,
              entity: entityToEdit,
              afterUpsertSuccess: this.props.refetchFn
            }) : null}
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

EntityTable.propTypes = {
  entities: PropTypes.array.isRequired,
  refetchFn: PropTypes.func,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      propertyName: PropTypes.string
    })
  ).isRequired,
  actionMenuItem: PropTypes.array,
  deleteEntityGQL: PropTypes.object,
  upsertEntityModal: PropTypes.object,
  searchFn: PropTypes.func,
  entityName: PropTypes.string.isRequired,
  paginationFn: PropTypes.func,
  paginationInfo: PropTypes.shape({
    rows: PropTypes.number,
    start: PropTypes.number,
    rowsPerPage: PropTypes.number
  })
};
