import React from 'react';
import PropTypes from 'prop-types';
import { Chip, FontIcon, Avatar } from 'react-md';

import './StepChip.scss';

const StepChip = ({ step, removeStep, ...props }) => {
  const handleRemove = () => {
    removeStep(step);
  };

  return (
    <Chip
      {...props}
      label={step.name}
      avatar={<Avatar icon={<FontIcon>{step.icon}</FontIcon>} suffix="pink"/>}
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
