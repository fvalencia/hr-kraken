import React, { Component } from "react";
import SimplePlainTable from "../../components/SimpleTable/SimpleTable";

class Home extends Component {
  render() {
    return (
      <div>
        <h1 className="page-h1">Home Page</h1>
        <SimplePlainTable />
      </div>
    );
  }
}

export default Home;
