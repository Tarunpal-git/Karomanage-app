import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useState } from "react";
import { TUnmarkedEmployeeAttendance } from "../utils/generateUnmarkedEmployeeData";
import Tooltip from "react-native-walkthrough-tooltip";
import Flex from "../../../../@ui/flex/Flex";
import FSwitch from "../../../../@ui/switch/FSwitch";
import CheckBox from "../../../../@ui/check-box/CheckBox";
import ScalableText from "../../../../@ui/scalable-text/ScalableText";
import { COLORS } from "../../../../colors";
import Divider from "../../../../@ui/divider/Divider";

interface IEmployeeAttendancePopover {
  updateAttendanceList: React.Dispatch<
    React.SetStateAction<TUnmarkedEmployeeAttendance[]>
  >;
  data: TUnmarkedEmployeeAttendance;
}

const EmployeeAttendancePopover: FC<IEmployeeAttendancePopover> = ({
  updateAttendanceList,
  data,
}) => {
  const [tooltip, setTooltip] = useState(false);
  const [attendance, setAttendance] = useState(data);
  const [tooltipKey, setTooltipKey] = useState(0);

  const handleAvailabilityChange = (status: string, interval: string) => {
    setAttendance((previous) => ({
      ...previous,
      availablityStatus: { status, interval },
    }));
    setTooltipKey((prevKey) => prevKey + 1); // Increment key to force re-render
  };

  const handleClose = () => {
    updateAttendanceList((previousAttendance) =>
      previousAttendance.map((item) =>
        item.employeeId === attendance.employeeId ? attendance : item
      )
    );
    setTooltip(false);
  };

  return (
    <Tooltip
      isVisible={tooltip}
      onClose={handleClose}
      backgroundColor="#00000025"
      childContentSpacing={10}
      contentStyle={{
        elevation: 4,
        width: 132,
        borderRadius: 4,
        padding: 25,
        paddingVertical: 10,
        justifyContent: "center",
      }}
      content={
        <View>
          <TouchableOpacity
            onPress={() => handleAvailabilityChange("FullDay", "")}
          >
            <Flex my={5}>
              <CheckBox
                size={15}
                checked={attendance.availablityStatus.status === "FullDay"}
              />
              <ScalableText style={styles.optionText} fontFamily="Regular">
                Full Day
              </ScalableText>
            </Flex>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAvailabilityChange("HalfDay", "1")}
          >
            <Flex my={5}>
              <CheckBox
                size={15}
                checked={attendance.availablityStatus.status === "HalfDay"}
              />
              <ScalableText style={styles.optionText} fontFamily="Regular">
                Half Day
              </ScalableText>
            </Flex>
          </TouchableOpacity>

          {attendance.availablityStatus.status === "HalfDay" && (
            <View>
              <Divider my={8} />
              <TouchableOpacity
                onPress={() => handleAvailabilityChange("HalfDay", "1")}
              >
                <Flex my={5}>
                  <CheckBox
                    size={15}
                    checked={attendance.availablityStatus.interval === "1"}
                  />
                  <ScalableText style={styles.optionText} fontFamily="Regular">
                    1 Interval
                  </ScalableText>
                </Flex>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleAvailabilityChange("HalfDay", "2")}
              >
                <Flex my={5}>
                  <CheckBox
                    size={15}
                    checked={attendance.availablityStatus.interval === "2"}
                  />
                  <ScalableText style={styles.optionText} fontFamily="Regular">
                    2 Interval
                  </ScalableText>
                </Flex>
              </TouchableOpacity>
            </View>
          )}
        </View>
      }
      placement="top"
      arrowSize={{ width: 0, height: 0 }}
      key={tooltipKey}
    >
      <Flex justify="center">
        <FSwitch
          disabled={tooltip}
          onChange={(e) => {
            if (e) {
              setTooltip(true);
            } else {
              setTooltip(false);
            }
            setAttendance((previous) => ({
              ...previous,
              attendanceStatus: e ? "present" : "absent",
            }));
          }}
          value={attendance.attendanceStatus === "present"}
          showLabels={false}
        />
      </Flex>
    </Tooltip>
  );
};

export default memo(EmployeeAttendancePopover);

const styles = StyleSheet.create({
  optionText: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 5,
    color: COLORS.primary,
  },
});
