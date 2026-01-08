import React, { FC, memo, useEffect, useState } from "react";
import Flex from "../../../../@ui/flex/Flex";
import GridTable from "../../../../@ui/table/GridTable";
import { TTableColumns } from "../../../../types/table/tableColomuns";
import { useEmployeesListQuery } from "../../../../apis/hooks/employee/query/useEmployeesList.query";

import {
  generateUnmarkedEmployeeData,
  TUnmarkedEmployeeAttendance,
} from "../utils/generateUnmarkedEmployeeData";
import Button from "../../../../@ui/button/Button";
import EmployeeAttendancePopover from "./EmployeeAttendancePopover";
import { useMarkEmployeeAttendanceMutation } from "../../../../apis/hooks/attendance/mutation/useMarkEmployeeAttendance.mutation";
import moment from "moment";
import { employeeColumns } from "../columns/tableColumns";

interface IUnmarkedEmployeeAttendance {
  refetch: () => void;
  attendanceDate: Date;
}

const UnmarkedEmployeeAttendance: FC<IUnmarkedEmployeeAttendance> = ({
  attendanceDate,
  refetch,
}) => {
  const [employeesList, setEmployeesList] = useState<
    TUnmarkedEmployeeAttendance[]
  >([]);

  const { data, isLoading } = useEmployeesListQuery();

  const tableColumns = [...employeeColumns];

  tableColumns.push({
    key: "attendance",
    label: "Attendance",
    minWidth: 115,
    renderCell: (row) => (
      <EmployeeAttendancePopover
        data={row}
        updateAttendanceList={setEmployeesList}
      />
    ),
  });

  useEffect(() => {
    if (!isLoading && data) {
      setEmployeesList(generateUnmarkedEmployeeData(data.data));
    } else {
      setEmployeesList([]);
    }
  }, [data, isLoading]);

  const { mutateAsync, isPending } = useMarkEmployeeAttendanceMutation();

  const submitAttendance = async () => {
    const res = await mutateAsync({
      attendanceId: moment(attendanceDate).format("YYYYMMDD"),
      employees: employeesList.map((employee) => ({
        attendanceStatus: employee.attendanceStatus,
        employeeId: employee.employeeId,
        availablityStatus: employee.availablityStatus,
        totalHours: employee.totalHours,
      })),
    });

    if (res.statusCode === 200) {
      refetch();
    } else {
      customAlert.show({ message: "Attendance not marked" });
    }
  };

  return (
    <Flex mt={15} flexDirection="column" align="flex-start">
      <Flex>
        <GridTable
          data={employeesList}
          columns={tableColumns as TTableColumns<unknown>[]}
          isLoading={isLoading}
          showScroll={false}
          tableContainer={{ minHeight: "auto" }}
        />
      </Flex>
      <Flex justify="flex-end" mt={20} w={"100%"}>
        <Button
          onPress={submitAttendance}
          title="Submit"
          btnStyles={{ width: 129, height: 40 }}
          btnTxtStyles={{ fontFamily: "Poppins-Regular", fontSize: 14 }}
          loading={isPending}
          disabled={isPending}
        />
      </Flex>
    </Flex>
  );
};

export default memo(UnmarkedEmployeeAttendance);
