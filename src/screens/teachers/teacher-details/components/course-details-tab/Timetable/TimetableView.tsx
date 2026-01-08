
import React, { useEffect, useMemo, useState } from "react";
import { View, Alert } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../app/store";
import { useGetClassroomListQuery } from "../../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
import { useBatchListsQuery } from "../../../../../../apis/hooks/batch/query/useBatchLists.query";
import { useTeachersListQuery } from "../../../../../../apis/hooks/teachers/query/useTeachersList.query";
import { useCourseListsQuery } from "../../../../../../apis/hooks/course/query/useCourseLists.query";
import { useTimeTableQuery } from "../../../../../../apis/hooks/teachers/query/useTimeTable.query";
import { useDeleteTimeTableMutation } from "../../../../../../apis/hooks/timetable/mutations/useDeleteTimeTable.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { COLORS } from "../../../../../../colors";
import TimetableHeader from "./TimetableHeader";
import TimetableGrid, { TTimetableCell } from "./TimetableGrid";
import SlotFormModal from "./SlotFormModal";

type TBatchOption = {
  id?: string;
  label: string;
};

// Get Monday of week
const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 7 : d.getDay();
  d.setDate(d.getDate() - (day - 1));
  return d;
};

const DEFAULT_HOURS = {
  openingTime: "09:00",
  closingTime: "18:00",
};

const minutesFromTime = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};

const formatTimeFromMinutes = (value: number) => {
  const h = Math.floor(value / 60).toString().padStart(2, "0");
  const m = (value % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

const buildHourSlots = (opening: string, closing: string) => {
  // Web jaisa logic: closing hour ko exclude karte hain
  const openingHour = parseInt(opening?.split(":")[0] || "0", 10);
  const closingHour = parseInt(closing?.split(":")[0] || "0", 10);
  const slots: string[] = [];
  
  // closingHour - openingHour = number of slots (closing hour excluded)
  for (let i = 0; i < closingHour - openingHour; i++) {
    const hour = openingHour + i;
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  
  return slots;
};

type TimetableViewProps = {
  onRequestClassroomsTab?: () => void;
};

const TimetableView = ({ onRequestClassroomsTab }: TimetableViewProps) => {
  const { selectedOrganization } = useSelector((state: RootState) => state.auth);
  const { data } = useGetClassroomListQuery();
  const { data: batchData, isLoading: isBatchLoading } = useBatchListsQuery();
  const { data: teacherData } = useTeachersListQuery();
  const { data: courseData } = useCourseListsQuery();

  const [activeCell, setActiveCell] = useState<TTimetableCell | null>(null);
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [editingSlot, setEditingSlot] = useState<any | null>(null);
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteTimeTableMutation();

  // ⭐ Batch options from API
  const batchOptions = useMemo<TBatchOption[]>(() => {
    if (batchData?.statusCode === 200 && Array.isArray(batchData.data)) {
      return batchData.data.map((batch: any) => ({
        id: batch.batchId ?? batch.batchCode ?? batch.batchName,
        label: batch.batchName ?? batch.batchCode ?? "Unnamed batch",
      }));
    }
    return [];
  }, [batchData]);

  // ⭐ Set default batch on load
  useEffect(() => {
    if (!isBatchLoading && batchOptions.length && !selectedBatch) {
      setSelectedBatch(batchOptions[0].label);
    }
  }, [isBatchLoading, batchOptions, selectedBatch]);

  // ⭐ Selected batch ID for API
  const selectedBatchId = useMemo(() => {
    const batch = batchOptions.find((b) => b.label === selectedBatch);
    return batch?.id || "";
  }, [batchOptions, selectedBatch]);

  // ⭐ WEEK START
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));

  // ⭐ NEXT WEEK
  const handleNextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + 7);
    setWeekStart(next);
  };

  // ⭐ PREV WEEK
  const handlePrevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev);
  };

  // ⭐ Dynamic month label
  const monthLabel = weekStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // ⭐ Week days
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // Hours from API
  const opening =
    data?.data?.openingTime ??
    data?.data?.operatingHours?.openingTime ??
    DEFAULT_HOURS.openingTime;

  const closing =
    data?.data?.closingTime ??
    data?.data?.operatingHours?.closingTime ??
    DEFAULT_HOURS.closingTime;

  const hourSlots = useMemo(() => buildHourSlots(opening, closing), [opening, closing]);

  // ⭐ TIMETABLE API CALL
  const startWeekDate = useMemo(() => {
    return weekStart.toISOString().split('T')[0];
  }, [weekStart]);

  const endWeekDate = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    return end.toISOString().split('T')[0];
  }, [weekStart]);

  const timeTableParams = useMemo(() => ({
    customerId: selectedOrganization?.customerId || "",
    organizationId: selectedOrganization?.organizationId || "",
    batchId: selectedBatchId,
    startWeekDate: startWeekDate,
    endWeekDate: endWeekDate,
  }), [selectedOrganization, selectedBatchId, startWeekDate, endWeekDate]);

  const { data: timeTableData } = useTimeTableQuery(timeTableParams);

  // ⭐ TEACHER MAP
  const teacherMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    if (teacherData?.statuscode === 200) {
      teacherData.data.forEach((t: any) => {
        map[t.teacherId] = `${t.teacherFirstName} ${t.teacherLastName || ""}`.trim();
      });
    }
    return map;
  }, [teacherData]);

  // ⭐ SUBJECT MAP (from courses)
  const subjectMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    if (courseData?.statusCode === 200) {
      courseData.data.forEach((c: any) => {
        c.subjects?.forEach((s: any) => {
          map[s.subjectId] = s.subjectName;
        });
      });
    }
    return map;
  }, [courseData]);

  // ⭐ CLASSROOM MAP
  const classroomMap = useMemo(() => {
    const map: { [key: string]: string } = {};
    if (data?.statusCode === 200) {
      data.data.classRooms.forEach((room: any) => {
        map[room.classRoomId] = room.classRoomName;
      });
    }
    return map;
  }, [data]);

  // ⭐ REPEAT DAYS from timetable API
  const repeatDays = useMemo(() => {
    return timeTableData?.data?.repeatDays || {};
  }, [timeTableData]);

  const handleCellPress = (cell: TTimetableCell) => {
    setActiveCell(cell);
    setEditingSlot(null); // Reset editing slot for new slot
    setSlotModalVisible(true);
  };

  // Handle edit slot
  const handleEditSlot = (slot: any, day: Date, hour: string) => {
    console.log("✏️ === HANDLE EDIT SLOT ===");
    console.log("✏️ Received slot:", JSON.stringify(slot, null, 2));
    console.log("✏️ Received day:", day);
    console.log("✏️ Received hour:", hour);
    
    // Create editing slot object with all necessary data
    const editingSlotData = {
      ...slot,
      day: new Date(day), // Ensure it's a proper Date object
      hour: hour,
    };
    console.log("✏️ Editing slot data:", JSON.stringify(editingSlotData, null, 2));
    
    // First set editing slot
    setEditingSlot(editingSlotData);
    
    // Then set active cell
    const dayIndex = day.getDay() === 0 ? 6 : day.getDay() - 1;
    setActiveCell({ dayIndex, day: new Date(day), hour });
    
    // Finally open modal
    setSlotModalVisible(true);
    
    console.log("✏️ Modal should be visible now");
    console.log("✏️ editingSlot state set to:", editingSlotData);
  };

  // Handle delete slot
  const handleDeleteSlot = (slot: any, day: Date, hour: string) => {
    // Get day key for the slot
    const dayOfWeek = day.getDay();
    const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
    const dayKey = dayKeys[dayOfWeek];

    // Build delete payload
    const deletePayload = {
      customerId: selectedOrganization?.customerId,
      organizationId: selectedOrganization?.organizationId,
      batchId: selectedBatchId,
      startDate: startWeekDate,
      endDate: endWeekDate,
      id: slot.id || slot.slotId, // Use id or slotId from slot
      dayKey: dayKey,
      startTime: slot.startTime,
      endTime: slot.endTime,
    };

    console.log("🗑️ Delete payload:", JSON.stringify(deletePayload, null, 2));

    deleteMutation.mutate(deletePayload, {
      onSuccess: (response) => {
        console.log("✅ Delete success:", response);
        console.log("🗑️ Delete response:", JSON.stringify(response, null, 2));
        
        // Invalidate ALL timetable queries (with any params) to refresh grid
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey[0] === "timeTable" || query.queryKey[0] === "getTimeTable";
          },
        });
        
        // Refetch with exact params after a short delay
        if (timeTableParams && selectedOrganization && selectedBatchId) {
          console.log("🔄 Refetching timetable after delete with params:", timeTableParams);
          setTimeout(() => {
            queryClient.refetchQueries({
              queryKey: ["timeTable", timeTableParams],
            }).then(() => {
              console.log("✅ Timetable refetched after delete");
            }).catch((err) => {
              console.error("❌ Refetch error after delete:", err);
            });
          }, 800); // Increased delay to ensure backend has processed
        } else {
          // Fallback: refetch all timeTable queries
          setTimeout(() => {
            queryClient.refetchQueries({
              predicate: (query) => {
                return query.queryKey[0] === "timeTable";
              },
            });
          }, 800);
        }
      },
      onError: (error: any) => {
        console.error("❌ Delete error:", error);
        Alert.alert("Error", error?.message || "Failed to delete slot");
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <TimetableHeader
        selectedBatch={selectedBatch}
        batchOptions={batchOptions}
        onBatchSelect={(batchLabel) => setSelectedBatch(batchLabel)}
        onAddSlotPress={() => setSlotModalVisible(true)}
        monthLabel={monthLabel}
        onPrevPress={handlePrevWeek}
        onNextPress={handleNextWeek}
      />

      <TimetableGrid
        days={days}
        hours={hourSlots}
        activeCell={activeCell}
        onCellPress={handleCellPress}
        timeTableData={timeTableData}
        repeatDays={repeatDays}
        teacherMap={teacherMap}
        subjectMap={subjectMap}
        classroomMap={classroomMap}
        onEditSlot={handleEditSlot}
        onDeleteSlot={handleDeleteSlot}
      />

      <SlotFormModal
        visible={slotModalVisible}
        selectedCell={activeCell}
        editingSlot={editingSlot}
        onClose={() => {
          setSlotModalVisible(false);
          setEditingSlot(null);
          setActiveCell(null);
        }}
        onNavigateToClassrooms={onRequestClassroomsTab}
        selectedBatch={selectedBatch}
        selectedBatchId={selectedBatchId}
        batchData={batchData}
        weekStart={weekStart}
        selectedOrganization={selectedOrganization}
      />
    </View>
  );
};

export default TimetableView;


