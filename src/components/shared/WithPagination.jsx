import React from 'react';

export function withPagination(WrappedComponent) {
  return class EntityWithPagination extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        paginationInfo: {
          rows: 0,
          rowsPerPage: 10,
          start: 0
        }
      };
    }

    handlePagination = (start, rowsPerPage) => {
      const { paginationInfo } = this.state;
      paginationInfo.start = start;
      paginationInfo.rowsPerPage = rowsPerPage;
      this.setState({ paginationInfo });
    };

    render() {
      const { paginationInfo } = this.state;
      const newProps = {
        paginationInfo,
        paginationFn: this.handlePagination
      };
      return <WrappedComponent {...this.props} {...newProps}/>
    }
  }
}
