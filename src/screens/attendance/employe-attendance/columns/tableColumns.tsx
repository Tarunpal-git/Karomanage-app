import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import React from "react";
import { TUnmarkedEmployeeAttendance } from "../utils/generateUnmarkedEmployeeData";
import { isEmptyString } from "../../../../utils/isEmptyString";

export const employeeColumns: TTableColumns<TUnmarkedEmployeeAttendance>[] = [
  {
    key: "name",
    label: "Name",
    minWidth: 120,
    headerCellStyle: { alignItems: "center" },
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, textAlign: "center" }}
      >
        {isEmptyString(row?.name)}
      </ScalableText>
    ),
  },
  {
    key: "designation",
    label: "Designation",
    minWidth: 120,
    headerCellStyle: { alignItems: "center" },
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, textAlign: "center" }}
      >
        {isEmptyString(row?.designation)}
      </ScalableText>
    ),
  },
];
