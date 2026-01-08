import React, { FC, memo, useEffect, useMemo, useState } from "react";
import Flex from "../../../../@ui/flex/Flex";
import GridTable from "../../../../@ui/table/GridTable";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import { useStudentsListQuery } from "../../../../apis/hooks/students/query/useStudentsList.query";
import {
  filterBatchStudents,
  TFilterUnmarkedStudents,
} from "../../utils/filterBatchStudents";
import { useBatchDetailsQuery } from "../../../../apis/hooks/batch/query/useBatchDetails.query";
import { TScreenNavigatorParams } from "../../../../types/navigator/screen-navigator";
import { RouteProp, useRoute } from "@react-navigation/native";
import { studentAttendanceColumns } from "../columns/studentAttendanceColumns";
import FSwitch from "../../../../@ui/switch/FSwitch";
import { useMarkStudentAttendanceMutation } from "../../../../apis/hooks/attendance/mutation/useMarkStudentAttendance.mutation";
import moment from "moment";
import Button from "../../../../@ui/button/Button";

interface IUnmarkedStudentsAttendanceView {
  attendanceDate: Date;
  refetch: () => void;
}

const UnmarkedStudentsAttendanceView: FC<IUnmarkedStudentsAttendanceView> = ({
  attendanceDate,
  refetch,
}) => {
  const { batchId } =
    useRoute<RouteProp<TScreenNavigatorParams, "StudentAttendance">>().params;
  const { data: batchData, isLoading: batchLoading } = useBatchDetailsQuery({
    batchId,
  });

  const tableColumns = [...studentAttendanceColumns];

  const batchDetails: TBatchData = useMemo(() => {
    if (!batchLoading && batchData) {
      return batchData.data;
    } else {
      return undefined;
    }
  }, [batchLoading, batchData]);

  const { data: studentData, isLoading: studentListLoading } =
    useStudentsListQuery();

  const [studentsList, setStudentsList] = useState<TFilterUnmarkedStudents[]>(
    []
  );

  useEffect(() => {
    if (!studentListLoading && studentData.statuscode === 200 && batchDetails) {
      const filteredStudents = filterBatchStudents(
        batchDetails.students,
        studentData.data
      );
      setStudentsList(filteredStudents);
    }
  }, [studentListLoading, studentData, batchDetails]);

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setStudentsList((prevList) =>
      prevList.map((student) =>
        student.studentId === studentId
          ? { ...student, attendanceStatus: isPresent ? "present" : "absent" }
          : student
      )
    );
  };

  tableColumns.push({
    key: "attendance",
    label: "Attendance",
    minWidth: 115,
    headerTextStyles: { marginBottom: 20 },

    renderCell: (row) => (
      <Flex justify="center">
        <FSwitch
          onChange={() =>
            handleAttendanceChange(
              row.studentId,
              row.attendanceStatus !== "present"
            )
          }
          value={row.attendanceStatus === "present"}
          showLabels={false}
        />
      </Flex>
    ),
  });

  const { mutateAsync, isPending } = useMarkStudentAttendanceMutation();

  const submitAttendance = async () => {
    const res = await mutateAsync({
      attendanceId: moment(attendanceDate).format("YYYYMMDD"),
      batchId,
      students: studentsList.map((student) => ({
        attendanceStatus: student.attendanceStatus,
        studentId: student.studentId,
      })),
    });

    if (res.statusCode === 200) {
      refetch();
    } else {
      customAlert.show({ message: "Attendance not marked" });
    }
  };

  return (
    <Flex flexDirection="column" align="flex-end">
      <Flex>
        <GridTable
          columns={tableColumns as TTableColumns<unknown>[]}
          data={studentsList}
          isLoading={studentListLoading}
          headerTextStyles={{ textAlign: "center" }}
          showScroll={false}
          tableContainer={{ minHeight: "auto" }}
          headerHeight={80}
        />
      </Flex>
      <Flex justify="flex-end" mt={20}>
        <Button
          onPress={submitAttendance}
          loading={isPending}
          disabled={isPending}
          title="Submit"
          btnStyles={{ width: 129, height: 40 }}
          btnTxtStyles={{ fontFamily: "Poppins-Regular", fontSize: 14 }}
        />
      </Flex>
    </Flex>
  );
};

export default memo(UnmarkedStudentsAttendanceView);
