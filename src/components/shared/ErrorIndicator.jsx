import React from 'react';
import PropTypes from 'prop-types';

const ErrorIndicator = ({ errorMessage }) => (
  <div className="">
    <div>{errorMessage}</div>
  </div>
);
ErrorIndicator.propTypes = {
  errorMessage: PropTypes.string
};

export default ErrorIndicator;
