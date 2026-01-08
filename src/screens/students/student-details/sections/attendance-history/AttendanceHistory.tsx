import React, { FC, memo } from "react";

import PopoverBatchRow from "./PopoverBatchRow";
import { View } from "react-native";

interface IAttendanceHistory {
  details: TStudentList;
}

const AttendanceHistory: FC<IAttendanceHistory> = ({ details }) => {
  return (
    <View style={{ flex: 1 }}>
      {details.batch.map((batch, index) => (
        <PopoverBatchRow
          index={index}
          key={batch.batchId}
          batchId={batch.batchId}
          studentId={details.rollNo}
        />
      ))}
    </View>
  );
};

export default memo(AttendanceHistory);
