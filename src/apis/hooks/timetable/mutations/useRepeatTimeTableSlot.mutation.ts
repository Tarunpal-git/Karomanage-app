import { useMutation } from "@tanstack/react-query";
import { request } from "../../../../services/axios.service";
import { apiUrls } from "../../../urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../app/store";

// Payload types
type WeekRange = {
  startDate: string;
  endDate: string;
};

export type RepeatTimeTableSlotPayload = {
  customerId: string;
  organizationId: string;
  batchId: string;
  currentWeek: WeekRange;
  nextWeek: WeekRange;
};

// Response types
type RepeatDaySlot = {
  id: string;
  type: string;
  teacherType: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  classRoomId: string;
  teacherId: string;
  status: string;
};

type RepeatDays = {
  M: RepeatDaySlot[];
  T: RepeatDaySlot[];
  W: RepeatDaySlot[];
  Th: RepeatDaySlot[];
  F: RepeatDaySlot[];
  Sa: RepeatDaySlot[];
  Su: RepeatDaySlot[];
};

export type RepeatTimeTableSlotResponse = {
  data: {
    customerId: string;
    organizationId: string;
    batchId: string;
    repeatDays: RepeatDays;
  };
  statusCode: number;
  message: string;
};

export const useRepeatTimeTableSlotMutation = () => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);

  return useMutation({
    mutationFn: async (data: RepeatTimeTableSlotPayload): Promise<RepeatTimeTableSlotResponse> => {
      if (!selectedOrganization) {
        throw new Error("No organization selected");
      }

      const payload: RepeatTimeTableSlotPayload = {
        customerId: data.customerId || selectedOrganization.customerId,
        organizationId: data.organizationId || selectedOrganization.organizationId,
        batchId: data.batchId,
        currentWeek: data.currentWeek,
        nextWeek: data.nextWeek,
      };

      console.log("🔄 === REPEAT TIMETABLE SLOT API CALL ===");
      console.log("API URL:", apiUrls.timetable.REPEAT_TIME_TABLE_SLOT);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await request({
        method: "POST",
        url: apiUrls.timetable.REPEAT_TIME_TABLE_SLOT,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("🔄 REPEAT TIMETABLE SLOT RESPONSE:", JSON.stringify(response, null, 2));
      console.log("🔄 === END REPEAT TIMETABLE SLOT API CALL ===");

      return response as RepeatTimeTableSlotResponse;
    },
  });
};