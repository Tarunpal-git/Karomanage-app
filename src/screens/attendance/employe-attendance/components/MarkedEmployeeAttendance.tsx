import React, { FC, memo, useEffect, useState } from "react";
import EmployeeAttendanceOverview from "./EmployeeAttendanceOverview";
import { useEmployeesListQuery } from "../../../../apis/hooks/employee/query/useEmployeesList.query";
import Flex from "../../../../@ui/flex/Flex";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import GridTable from "../../../../@ui/table/GridTable";

import {
  generateMarkedEmployeeData,
  TMarkedEmployeeAttendanceData,
} from "../utils/generateMarkedEmployeeData";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import EditEmployeeAttendanceModal from "./EditEmployeeAttendanceModal";
import { View } from "react-native";
import { markedAttendanceEmployeesColumns } from "../columns/markedAttendanceEmployeesColumns";

interface IMarkedEmployeeAttendance {
  attendance: TSingleEmployeeAttendance;
  attendanceDate: Date;
  refetch: () => void;
}

const MarkedEmployeeAttendance: FC<IMarkedEmployeeAttendance> = ({
  attendance,
  attendanceDate,
  refetch,
}) => {
  const [editModal, setEditModal] = useState<{
    show: boolean;
    data: TMarkedEmployeeAttendanceData | undefined;
  }>({ show: false, data: undefined });
  const { data, isLoading } = useEmployeesListQuery();
  const [attendanceList, setAttendanceList] = useState<
    TMarkedEmployeeAttendanceData[]
  >([]);

  const tableColumns = [...markedAttendanceEmployeesColumns];

  tableColumns.push({
    key: "action",
    label: "Action",
    minWidth: 100,
    renderCell: (row) => (
      <ActionIcon
        styles={{ padding: 15 }}
        onPress={() => setEditModal({ data: row, show: true })}
      >
        <AutoHeightImage source={IMAGES.editIcon} width={21} />
      </ActionIcon>
    ),
  });

  useEffect(() => {
    if (!isLoading && data) {
      setAttendanceList(
        generateMarkedEmployeeData(data.data, attendance.employees)
      );
    } else {
      setAttendanceList([]);
    }
  }, [data, isLoading, attendance]);

  return (
    <View>
      <EmployeeAttendanceOverview attendance={attendance} />

      <Flex>
        <GridTable
          data={attendanceList}
          columns={tableColumns as TTableColumns<unknown>[]}
          isLoading={isLoading}
          tableContainer={{ overflow: "hidden" }}
          fixedFirstElement
        />
      </Flex>

      {editModal.show && editModal.data && (
        <EditEmployeeAttendanceModal
          attendanceDate={attendanceDate}
          data={editModal.data}
          handleClose={() => setEditModal({ data: undefined, show: false })}
          isVisible={editModal.show}
          refetch={refetch}
          students={attendanceList}
        />
      )}
    </View>
  );
};

export default memo(MarkedEmployeeAttendance);
