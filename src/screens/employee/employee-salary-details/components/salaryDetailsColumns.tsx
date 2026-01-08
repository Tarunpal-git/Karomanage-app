import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import React from "react";

export const salaryDetailsColumns: TTableColumns<TSalaryRecord>[] = [
  {
    label: "Total Salary",
    key: "totalSalary",
    minWidth: 90,
    headerCellStyle: { marginLeft: 20 },
    dataCellStyle: { marginLeft: 20 },
    renderCell: (row) => (
      <ScalableText fontFamily="Regular" style={{ fontSize: 12 }}>
        {Number(row.totalSalary).toLocaleString()}
      </ScalableText>
    ),
  },
  {
    label: "Total Working Days",
    key: "totalWorkingDays",
    minWidth: 120,
  },
  {
    label: "Loss Of Days",
    key: "lossOfDays",
    minWidth: 110,
  },
  {
    label: "In-hand Salary",
    key: "fixedInhandSalary",
    minWidth: 90,
    renderCell: (row) => (
      <ScalableText fontFamily="Regular" style={{ fontSize: 12 }}>
        {Number(row.fixedInhandSalary).toLocaleString()}
      </ScalableText>
    ),
  },
  { label: "Salary Date", key: "dateCreated", minWidth: 110 },
];
