import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import PopoverText from "../../../../@ui/popover-text/PopoverText";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { IMAGES } from "../../../../images";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import React from "react";

export const batchesColumns: TTableColumns<TBatchData>[] = [
  {
    key: "batchName",
    label: "Batch Name",
    minWidth: 120,
    renderCell: (row) => <PopoverText text={row.batchName} width={120} />,
  },
  {
    key: "interval",
    label: "Interval",
    minWidth: 190,
    headerCellStyle: {
      alignItems: "center",
    },
    dataCellStyle: {
      alignItems: "center",
    },

    renderCell: (row) => (
      <ScalableText fontFamily="Regular" style={{ fontSize: 12 }}>
        {row?.batchStartDate} - {row.batchEndDate}
      </ScalableText>
    ),
  },
  {
    key: "",
    label: "",
    minWidth: 10,
    renderCell: () => (
      <AutoHeightImage source={IMAGES.chevronArrowRightIcon} width={8} />
    ),
  },
];
