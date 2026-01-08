import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import React from "react";
import { TFilteredAttendanceStudent } from "../utils/regenerateAttendanceStudentList";
import Avatar from "../../../../@ui/avatar/Avatar";
import { getStatusChipPallet } from "../../../../utils/getStatusChipPallet";

export const studentEditAttendanceColumns: TTableColumns<TFilteredAttendanceStudent>[] =
  [
    {
      key: "enrollmentNo",
      label: "Enrollment No.",
      minWidth: 150,
      renderCell: (row) => (
        <Flex>
          <Avatar content={row.name} />
          <ScalableText
            fontFamily="Regular"
            style={{ fontSize: 12, marginLeft: 13 }}
          >
            {row?.enrollmentNo}
          </ScalableText>
        </Flex>
      ),
    },
    {
      key: "name",
      label: "Name",
      minWidth: 145,
    },
    {
      key: "mobileNumber",
      label: "Mobile Number",
      minWidth: 200,
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
          {row?.attendanceStatus}
        </ScalableText>
      ),
    },
  ];
