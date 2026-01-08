import Avatar from "../../../../@ui/avatar/Avatar";
import Flex from "../../../../@ui/flex/Flex";
import React from "react";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import { getStatusColor } from "../../../../utils/getStatusColor";
import { isEmptyString } from "../../../../utils/isEmptyString";

export const columns: TTableColumns<TEnquiryData>[] = [
  {
    key: "student Name",
    label: "Student Name",
    minWidth: 150,
    renderCell: (row) => (
      <Flex>
        <Avatar content={row.studentName} />
        <ScalableText
          fontFamily="Regular"
          style={{ fontSize: 12, marginLeft: 5 }}
        >
          {isEmptyString(row?.studentName)}
        </ScalableText>
      </Flex>
    ),
  },
  {
    key: "enquiryCourse",
    label: "Enquiry Subject",
    minWidth: 150,
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, marginLeft: 5 }}
      >
        {isEmptyString(row?.enquiryCourse)}
      </ScalableText>
    ),
  },
  {
    key: "mobileNumber",
    label: "Mobile Number",
    minWidth: 150,
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, marginLeft: 5 }}
      >
        {isEmptyString(row?.mobileNumber)}
      </ScalableText>
    ),
  },
  {
    key: "email",
    label: "Email",
    minWidth: 230,
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, marginLeft: 5 }}
      >
        {isEmptyString(row?.email)}
      </ScalableText>
    ),
  },
  {
    key: "status",
    label: "Status",
    minWidth: 120,
    renderCell: (row) => (
      <ScalableText
        fontFamily="SemiBold"
        style={{
          fontSize: 12,
          marginLeft: 5,
          textTransform: "capitalize",
          color: getStatusColor(row?.status),
        }}
      >
        {row.status}
      </ScalableText>
    ),
  },
  {
    key: "manager",
    label: "Manager",
    minWidth: 120,
    renderCell: (row) => (
      <ScalableText
        fontFamily="Regular"
        style={{ fontSize: 12, marginLeft: 5 }}
      >
        {isEmptyString(row?.leadManager?.managerName)}
      </ScalableText>
    ),
  },
];
