import { Modal, ScrollView, StyleSheet } from "react-native";
import React, { FC, memo } from "react";
import { COLORS } from "../../../../colors";
import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import Button from "../../../../@ui/button/Button";
import { useForm } from "react-hook-form";
import MuiInput from "../../../../@ui/mui-input/MuiInput";
import FSwitch from "../../../../@ui/switch/FSwitch";
import moment from "moment";
import { TMarkedEmployeeAttendanceData } from "../utils/generateMarkedEmployeeData";
import { useUpdateEmployeeAttendanceMutation } from "../../../../apis/hooks/attendance/mutation/useUpdateEmployeeAttendance.mutation";
import { convertString } from "../columns/markedAttendanceEmployeesColumns";

interface IEditEmployeeAttendanceModal {
  isVisible: boolean;
  handleClose: () => void;
  data: TMarkedEmployeeAttendanceData;
  refetch: () => void;
  students: TMarkedEmployeeAttendanceData[];
  attendanceDate: Date;
}

const EditEmployeeAttendanceModal: FC<IEditEmployeeAttendanceModal> = ({
  data,
  handleClose,
  isVisible,
  refetch,
  students,
  attendanceDate,
}) => {
  const handler = useForm({
    values: {
      ...data,
      availablityStatus: {
        ...data.availablityStatus,
        status:
          data.availablityStatus.status === ""
            ? "FullDay"
            : data.availablityStatus.status,
      },
    },
  });

  const handleAvailabilityChange = (
    attendanceStatus: string,
    status: string,
    interval: string
  ) => {
    handler.reset({
      ...data,
      attendanceStatus: attendanceStatus,
      availablityStatus: {
        interval: interval,
        status: status,
      },
    });
  };

  const { mutateAsync, isPending } = useUpdateEmployeeAttendanceMutation();

  const updateAttendance = async (values: typeof data) => {
    const employeeList = students.map((employee) =>
      employee.employeeId === data.employeeId ? values : employee
    );

    const res = await mutateAsync({
      attendanceId: moment(attendanceDate).format("YYYYMMDD"),
      employees: employeeList.map((employee) => ({
        attendanceStatus: employee.attendanceStatus,
        availablityStatus: employee.availablityStatus,
        employeeId: employee.employeeId,
        totalHours: employee.totalHours,
      })),
    });

    if (res.statusCode === 200) {
      handleClose();
      refetch();
    } else {
      customAlert.show({ message: "Attendance not update" });
    }
  };

  const { watch } = handler;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
      visible={isVisible}
      onDismiss={handleClose}
    >
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={styles.centeredView}
        showsVerticalScrollIndicator={false}
      >
        <Flex styles={styles.modalView} flexDirection="column">
          <Flex my={20}>
            <ScalableText fontFamily="Medium">
              Edit Employee Attendance
            </ScalableText>
          </Flex>

          <Flex>
            <MuiInput
              handler={handler}
              label="Name"
              name="name"
              editable={false}
            />
          </Flex>
          <Flex>
            <MuiInput
              handler={handler}
              label="Designation"
              name="designation"
              editable={false}
            />
          </Flex>
          <Flex>
            <MuiInput
              handler={handler}
              label="Email"
              name="email"
              editable={false}
            />
          </Flex>

          <Flex w={"100%"} mt={20}>
            <Flex flexDirection="column">
              <ScalableText
                style={{
                  color: "#717171",
                  marginBottom: 6,
                  textTransform: "capitalize",
                }}
                fontFamily="Medium"
              >
                {watch("attendanceStatus")}:
              </ScalableText>
              <FSwitch
                showLabels={false}
                onChange={() => {
                  handleAvailabilityChange(
                    watch("attendanceStatus") !== "present"
                      ? "present"
                      : "absent",
                    "FullDay",
                    "1"
                  );
                }}
                value={watch("attendanceStatus") === "present"}
              />
            </Flex>

            <Flex flexDirection="column" ml={35}>
              <ScalableText
                style={{
                  color: "#717171",
                  marginBottom: 6,
                  textTransform: "capitalize",
                }}
                fontFamily="Medium"
              >
                {handler.watch("availablityStatus.status") === ""
                  ? "Full Day"
                  : convertString(handler.watch("availablityStatus.status"))}
                :
              </ScalableText>
              <FSwitch
                showLabels={false}
                onChange={() => {
                  handleAvailabilityChange(
                    handler.watch("attendanceStatus"),
                    handler.watch("availablityStatus.status") !== "FullDay"
                      ? "FullDay"
                      : "HalfDay",
                    ""
                  );
                }}
                value={handler.watch("availablityStatus.status") === "FullDay"}
              />
            </Flex>
            {watch("availablityStatus.status") === "HalfDay" && (
              <Flex flexDirection="column" ml={35}>
                <ScalableText
                  style={{
                    color: "#717171",
                    marginBottom: 6,
                    textTransform: "capitalize",
                  }}
                  fontFamily="Medium"
                >
                  Interval: {handler.watch("availablityStatus.interval")}
                </ScalableText>
                <FSwitch
                  showLabels={false}
                  onChange={() => {
                    handleAvailabilityChange(
                      handler.watch("attendanceStatus"),
                      handler.watch("availablityStatus.status"),
                      handler.watch("availablityStatus.interval") !== "2"
                        ? "2"
                        : "1"
                    );
                  }}
                  value={handler.watch("availablityStatus.interval") === "2"}
                />
              </Flex>
            )}
          </Flex>

          <Flex mt={20}>
            <Button
              btnStyles={styles.modalBtn}
              btnTxtStyles={styles.modalBtnText}
              title="Submit"
              disabled={isPending}
              loading={isPending}
              onPress={handler.handleSubmit(updateAttendance)}
            />
            <Button
              btnStyles={{
                ...styles.modalBtn,
                borderWidth: 1,
                borderColor: COLORS.primary,
                backgroundColor: COLORS.white,
              }}
              btnTxtStyles={{ ...styles.modalBtnText, color: COLORS.primary }}
              title="Cancel"
              onPress={handleClose}
            />
          </Flex>
        </Flex>
      </ScrollView>
    </Modal>
  );
};

export default memo(EditEmployeeAttendanceModal);

const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "relative",
    padding: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
    padding: 40,
    paddingVertical: 19,
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    width: 89,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    marginHorizontal: 3,
    elevation: 0,
  },
  modalBtnText: {
    fontSize: 13,
    letterSpacing: 1,
    fontFamily: "Poppins-Regular",
  },
});
