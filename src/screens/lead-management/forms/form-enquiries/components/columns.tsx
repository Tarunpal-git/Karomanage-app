import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../../types/table/tableColomuns";
import React from "react";
import { getStatusColor } from "../../../../../utils/getStatusColor";
import Flex from "../../../../../@ui/flex/Flex";

export const formEnquiriesColumns: TTableColumns<TFormEnquiry>[] = [
  {
    key: "formStatus",
    label: "Status",
    minWidth: 90,
    renderCell: (row) => (
      <ScalableText
        fontFamily="SemiBold"
        style={{
          fontSize: 11,
          marginLeft: 5,
          textTransform: "capitalize",

          color: getStatusColor(row.formStatus),
        }}
      >
        {row.formStatus}
      </ScalableText>
    ),
  },
  {
    key: "name",
    label: "Name",
    minWidth: 110,
    renderCell: (row) => (
      <Flex>
        <ScalableText
          fontFamily="Regular"
          style={{ fontSize: 11, textTransform: "capitalize" }}
        >
          {row.formData.name}
        </ScalableText>
      </Flex>
    ),
  },
 
  {
    key: "mobileNumber",
    label: "Mobile Number",
    minWidth: 150,
    renderCell: (row) => (
      <Flex mr={10}>
        <ScalableText fontFamily="Regular" style={{ fontSize: 11 }}>
          {row.formData.mobileNumber}
        </ScalableText>
      </Flex>
    ),
  },
  {
    key: "manager",
    label: "Manager",
    minWidth: 150,
    renderCell: (row) => (
      <Flex mr={10}>
        <ScalableText fontFamily="Regular" style={{ fontSize: 11 }}>
          {row?.formData?.leadManager?.managerName}
        </ScalableText>
      </Flex>
    ),
  },
];
