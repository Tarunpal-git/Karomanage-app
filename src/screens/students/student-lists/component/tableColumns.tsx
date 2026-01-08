import React from "react";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../types/table/tableColomuns";

export const studentColumns: TTableColumns<TStudentList>[] = [
  {
    key: "studentName",
    label: "Student Name",
    minWidth: 120,
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, marginLeft: 5, textTransform: "capitalize" }}
      >
        {row?.studentFirstName + " " + row?.studentLastName}
      </ScalableText>
    ),
  },
  {
    key: "studentContact",
    label: "Mobile\nNumber",
    minWidth: 150,
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, marginLeft: 5 }}
      >
        {row?.studentContact}
      </ScalableText>
    ),
  },
  {
    key: "studentEmail",
    label: "Email",
    minWidth: 200,
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, marginLeft: 5, textTransform: "lowercase" }}
      >
        {row?.studentEmail ? row.studentEmail : "-"}
      </ScalableText>
    ),
  },
  {
    key: "studentStatus",
    label: "Student Status",
    minWidth: 120,
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, marginLeft: 5, textTransform: "capitalize" }}
      >
        {row?.studentStatus}
      </ScalableText>
    ),
  },
];
