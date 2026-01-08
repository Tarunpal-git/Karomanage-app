import Avatar from "../../../../../@ui/avatar/Avatar";
import Flex from "../../../../../@ui/flex/Flex";
import PopoverText from "../../../../../@ui/popover-text/PopoverText";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import { TTableColumns } from "../../../../../types/table/tableColomuns";
import React from "react";
import { getStatusColor } from "../../../../../utils/getStatusColor";

export const tableColumns: TTableColumns<TUploadFormTemplate>[] = [
  {
    key: "formTitle",
    label: "Form\nName",
    minWidth: 130,
    renderCell: (row) => (
      <Flex mr={10}>
        <Avatar content={row.formTitle} />
        <ScalableText
          fontFamily="Regular"
          style={{ fontSize: 11, marginLeft: 5 }}
        >
          {row.formTitle}
        </ScalableText>
      </Flex>
    ),
  },
  {
    key: "formDescription",
    label: "Form\nDescription",
    minWidth: 130,
    renderCell: (row) => <PopoverText text={row.formDescription} width={139} />,
  },
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
];
