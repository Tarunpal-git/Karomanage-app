import React, { FC, memo, useEffect, useState } from "react";
import Flex from "../../../../@ui/flex/Flex";
import AttendanceOverviewSection from "./AttendanceOverviewSection";
import { useStudentsListQuery } from "../../../../apis/hooks/students/query/useStudentsList.query";
import GridTable from "../../../../@ui/table/GridTable";
import { studentEditAttendanceColumns } from "../columns/studentEditAttendanceColumns";
import {
  regenerateAttendanceStudentList,
  TFilteredAttendanceStudent,
} from "../utils/regenerateAttendanceStudentList";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import ActionIcon from "../../../../@ui/action-icon/ActionIcon";
import AutoHeightImage from "../../../../@ui/auto-height-image/AutoHeightImage";
import { IMAGES } from "../../../../images";
import EditStudentAttendanceModal from "./EditStudentAttendanceModal";

interface IMarkedStudentAttendanceView {
  attendance: TSingleAttendance;
  attendanceDate: Date;
  refetch: () => void;
}

const MarkedStudentAttendanceView: FC<IMarkedStudentAttendanceView> = ({
  attendance,
  attendanceDate,
  refetch,
}) => {
  const [studentsList, setStudentsList] = useState<
    TFilteredAttendanceStudent[]
  >([]);

  const [editModal, setEditModal] = useState<{
    show: boolean;
    data: TFilteredAttendanceStudent | undefined;
  }>({ show: false, data: undefined });

  const { data: studentData, isLoading: studentListLoading } =
    useStudentsListQuery();

  useEffect(() => {
    if (!studentListLoading && studentData.statuscode === 200) {
      const filteredStudents = regenerateAttendanceStudentList(
        attendance.students,
        studentData.data
      );
      setStudentsList(filteredStudents);
    }
  }, [studentListLoading, studentData, attendance]);

  const tableColumns = [...studentEditAttendanceColumns];

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

  return (
    <Flex flexDirection="column">
      <AttendanceOverviewSection
        data={{
          absent: attendance.absent,
          present: attendance.present,
          totalStudents: attendance.students.length,
        }}
      />

      <Flex>
        <GridTable
          columns={tableColumns as TTableColumns<unknown>[]}
          data={studentsList ?? []}
          isLoading={studentListLoading}
        />
      </Flex>
      {editModal.show && editModal.data && (
        <EditStudentAttendanceModal
          attendanceDate={attendanceDate}
          data={editModal.data}
          handleClose={() => setEditModal({ data: undefined, show: false })}
          isVisible={editModal.show}
          refetch={refetch}
          students={studentsList}
        />
      )}
    </Flex>
  );
};

export default memo(MarkedStudentAttendanceView);
