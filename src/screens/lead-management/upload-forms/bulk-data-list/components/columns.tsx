import { TTableColumns } from "../../../../../types/table/tableColomuns";
import React from "react";
import { getStatusColor } from "../../../../../utils/getStatusColor";
import ScalableText from "../../../../../@ui/scalable-text/ScalableText";
import ActionPopover from "./ActionPopover";
import PopoverText from "../../../../../@ui/popover-text/PopoverText";

interface ICreateDynamicColumns {
  editCallback: () => void;
  refetch: () => void;
  fields: TExtendedFormType;
}

export const createDynamicColumns = (params: ICreateDynamicColumns) => {
  const { editCallback, fields, refetch } = params;
  const columns: TTableColumns<TBulkDataEnquiry>[] = [];

  columns.push(
    {
      key: "action",
      label: "",
      minWidth: 50,
      renderCell: (row) => (
        <ActionPopover
          handleEditClick={editCallback}
          refetch={refetch}
          row={row}
        />
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
            color: getStatusColor(row.formStatus),
          }}
        >
          {row.formStatus}
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
          {row?.formData?.leadManager?.managerName ?? "-"}
        </ScalableText>
      ),
    }
  );

  const excludeFields = ["followUp", "leadManager", "callLogs"];

  Object.keys(fields)
    .filter((key) => !excludeFields.includes(key))
    .forEach((key) => {
      columns.push({
        key: key as string,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        minWidth: 130,
        renderCell: (row) => {
          return <PopoverText text={row.formData[key]} width={139} />;
        },
      });
    });

  return columns;
};
