import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import React from "react";
import { TMarkedEmployeeAttendanceData } from "../utils/generateMarkedEmployeeData";
import { getStatusChipPallet } from "../../../../utils/getStatusChipPallet";
import { isEmptyString } from "../../../../utils/isEmptyString";

export const convertString = (input: string): string => {
  return input.replace(/([a-z])([A-Z])/g, "$1 $2");
};

export const markedAttendanceEmployeesColumns: TTableColumns<TMarkedEmployeeAttendanceData>[] =
  [
    {
      key: "name",
      label: "Name",
      minWidth: 120,
    },
    {
      key: "designation",
      label: "Designation",
      minWidth: 130,
    },
    {
      key: "dateOfBirth",
      label: "Date Of Birth",
      minWidth: 150,
    },
    {
      key: "email",
      label: "Email",
      minWidth: 250,
    },
    {
      key: "attendance",
      label: "Attendance",
      minWidth: 150,
      renderCell: (row) => (
        <ScalableText
          fontFamily="Medium"
          style={{
            fontSize: 12,
            textTransform: "capitalize",
            color: getStatusChipPallet(
              row.attendanceStatus === "absent" ? "error" : "success"
            ).textColor,
          }}
        >
          {isEmptyString(row?.attendanceStatus)}
        </ScalableText>
      ),
    },
    {
      key: "dayAttendance",
      label: "Day Attendance",
      minWidth: 200,
      renderCell: (row) => (
        <ScalableText
          fontFamily="Regular"
          style={{
            fontSize: 12,
            textTransform: "capitalize",
          }}
        >
          {isEmptyString(convertString(row?.availablityStatus.status)) }
        </ScalableText>
      ),
    },
    {
      key: "interval",
      label: "Interval",
      minWidth: 150,
      renderCell: (row) => (
        <ScalableText
          fontFamily="Medium"
          style={{
            fontSize: 12,
            textTransform: "capitalize",
            marginLeft: 25,
          }}
        >
          {isEmptyString(row?.availablityStatus.interval)}
        </ScalableText>
      ),
    },
  ];
