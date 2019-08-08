import React, { Fragment } from 'react';
import { Button, DialogContainer } from 'react-md';
import PropTypes from 'prop-types';

const ConfirmDialog = ({ title, message, visible, hasCancel = true, cancelLabel = 'Cancel', confirmLabel = 'Confirm', onEvent }) => {
  const actions = [];
  if (hasCancel) {
    actions.push({ secondary: true, children: cancelLabel, onClick: () => onEvent('cancel') });
  }

  actions.push(
    <Button flat primary onClick={() => onEvent('confirm')}>
      {confirmLabel}
    </Button>
  );

  return (
    <Fragment>
      <DialogContainer id="confirm-dialog" visible={visible} onHide={() => onEvent('hide')} actions={actions} title={title}>
        {message}
      </DialogContainer>
    </Fragment>
  );
};

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onEvent: PropTypes.func.isRequired
};

export default ConfirmDialog;
