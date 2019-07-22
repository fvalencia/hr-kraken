import React from "react";
import { DataTable, TableHeader, TableBody, TableRow, TableColumn } from "react-md";

const SimplePlainTable = () => (
  <DataTable plain>
    <TableHeader>
      <TableRow>
        <TableColumn>Lorem 1</TableColumn>
        <TableColumn>Lorem 2</TableColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from(Array(10)).map((_, i) => (
        <TableRow key={i}>
          <TableColumn>Test Column 1{i}</TableColumn>
          <TableColumn>Test Column 2{i}</TableColumn>
        </TableRow>
      ))}
    </TableBody>
  </DataTable>
);

export default SimplePlainTable;
