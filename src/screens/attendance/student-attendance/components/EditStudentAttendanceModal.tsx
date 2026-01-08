import { Modal, ScrollView, StyleSheet } from "react-native";
import React, { FC, memo, useState } from "react";
import { COLORS } from "../../../../colors";
import { TFilteredAttendanceStudent } from "../utils/regenerateAttendanceStudentList";
import Flex from "../../../../@ui/flex/Flex";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import Button from "../../../../@ui/button/Button";
import { useForm } from "react-hook-form";
import MuiInput from "../../../../@ui/mui-input/MuiInput";
import FSwitch from "../../../../@ui/switch/FSwitch";
import { useUpdateStudentAttendanceMutation } from "../../../../apis/hooks/attendance/mutation/useUpdateStudentAttendance.mutation";
import moment from "moment";
import { RouteProp, useRoute } from "@react-navigation/native";
import { TScreenNavigatorParams } from "../../../../types/navigator/screen-navigator";

interface IEditStudentAttendanceModal {
  isVisible: boolean;
  handleClose: () => void;
  data: TFilteredAttendanceStudent;
  refetch: () => void;
  students: TFilteredAttendanceStudent[];
  attendanceDate: Date;
}

const EditStudentAttendanceModal: FC<IEditStudentAttendanceModal> = ({
  data,
  handleClose,
  isVisible,
  refetch,
  students,
  attendanceDate,
}) => {
  const { batchId } =
    useRoute<RouteProp<TScreenNavigatorParams, "StudentAttendance">>().params;
  const [studentList, setStudentList] = useState(students);
  const handler = useForm({
    values: data,
  });

  const handleAttendanceChange = () => {
    setStudentList((prevList) =>
      prevList.map((student) =>
        student.studentId === data.studentId
          ? {
              ...student,
              attendanceStatus: handler.watch("attendanceStatus"),
            }
          : student
      )
    );
  };

  const { mutateAsync, isPending } = useUpdateStudentAttendanceMutation();

  const updateAttendance = async () => {
    const res = await mutateAsync({
      attendanceId: moment(attendanceDate).format("YYYYMMDD"),
      batchId,
      students: studentList.map((student) => ({
        attendanceStatus: student.attendanceStatus,
        studentId: student.studentId,
      })),
    });

    if (res.statusCode === 200) {
      handleClose();
      refetch();
    } else {
      customAlert.show({ message: "Attendance not update" });
    }
  };

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
              Edit Student Attendance
            </ScalableText>
          </Flex>

          <Flex>
            <MuiInput
              handler={handler}
              label="Enrollment no."
              name="enrollmentNo"
              editable={false}
            />
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
              label="Mobile no."
              name="mobileNumber"
              editable={false}
            />
          </Flex>

          <Flex justify="flex-start" w={"100%"} mt={30}>
            <ScalableText
              style={{
                color: "#717171",
                marginRight: 6,
                textTransform: "capitalize",
              }}
              fontFamily="Medium"
            >
              {handler.watch("attendanceStatus")}:
            </ScalableText>
            <FSwitch
              showLabels={false}
              onChange={() => {
                handleAttendanceChange();
                handler.setValue(
                  "attendanceStatus",
                  handler.watch("attendanceStatus") !== "present"
                    ? "present"
                    : "absent"
                );
              }}
              value={handler.watch("attendanceStatus") === "present"}
            />
          </Flex>

          <Flex mt={20}>
            <Button
              btnStyles={styles.modalBtn}
              btnTxtStyles={styles.modalBtnText}
              title="Submit"
              disabled={isPending}
              loading={isPending}
              onPress={updateAttendance}
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

export default memo(EditStudentAttendanceModal);

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
