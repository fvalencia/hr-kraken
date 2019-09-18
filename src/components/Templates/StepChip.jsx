import React from 'react';
import PropTypes from 'prop-types';
import { Chip, FontIcon } from 'react-md';

const StepChip = ({ step, removeStep, ...props }) => {
  const handleRemove = () => {
    removeStep(step);
  };

  return (
    <Chip
      {...props}
      label={step.name}
      avatar={<FontIcon>{step.icon}</FontIcon>}
      onClick={handleRemove}
      removable
    />
  );
};

StepChip.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }).isRequired,
  removeStep: PropTypes.func.isRequired
};

export default StepChip;
