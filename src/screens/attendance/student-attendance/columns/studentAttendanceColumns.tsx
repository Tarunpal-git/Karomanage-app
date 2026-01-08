import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import React from "react";
import { TFilterUnmarkedStudents } from "../../utils/filterBatchStudents";

export const studentAttendanceColumns: TTableColumns<TFilterUnmarkedStudents>[] =
  [
    {
      key: "name",
      label: "Name",
      minWidth: 100,
      headerCellStyle: { alignItems: "center" },
      headerTextStyles: { marginBottom: 20 },
      renderCell: (row) => (
        <ScalableText
          fontFamily="Regular"
          style={{ fontSize: 12, textAlign: "center" }}
        >
          {row.name}
        </ScalableText>
      ),
    },
    {
      key: "enrollment",
      label: "Enrollment\nNo.",
      minWidth: 120,
      headerCellStyle: { alignItems: "center" },
      renderCell: (row) => (
        <ScalableText
          fontFamily="Regular"
          style={{ fontSize: 12, textAlign: "center" }}
        >
          {row.enrollmentNo}
        </ScalableText>
      ),
    },
  ];
