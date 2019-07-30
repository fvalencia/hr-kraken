import React from 'react';
import PropTypes from 'prop-types';

const LoadingIndicator = ({ isLoading }) =>
  isLoading ? (
    <div className="">
      <div>Loading ...</div>
    </div>
  ) : null;

LoadingIndicator.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

export default LoadingIndicator;
