
import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTeachersListQuery } from "../../../../../../apis/hooks/teachers/query/useTeachersList.query";
import { useGetClassroomListQuery } from "../../../../../../apis/hooks/teachers/query/useGetClassroomList.query";
import { useCourseDetailsQuery } from "../../../../../../apis/hooks/course/query/useCourseDetails.query";
import { useCreateTimeTableMutation } from "../../../../../../apis/hooks/timetable/mutations/useCreateTimeTable.mutation";
import { useUpdateTimeTableMutation } from "../../../../../../apis/hooks/timetable/mutations/useUpdateTimeTable.mutation";
import { useQueryClient } from "@tanstack/react-query";
import { apiUrls } from "../../../../../../apis/urls";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../app/store";
import { COLORS } from "../../../../../../colors";
import { TTimetableCell } from "./TimetableGrid";

type SlotFormModalProps = {
  visible: boolean;
  selectedCell: TTimetableCell | null;
  editingSlot?: any | null; // Slot data when editing
  onClose: () => void;
  onNavigateToClassrooms?: () => void;
  selectedBatch?: string;
  selectedBatchId?: string;
  batchData?: any;
  onSuccess?: () => void; // Callback after successful creation
  weekStart?: Date; // Week start date for refetch
  selectedOrganization?: any; // Organization for refetch params
};

const PURPLE = "#6B57F2";
const DAY_KEYS = ["M", "T", "W", "Th", "F", "Sa", "Su"];

// Convert time string to minutes
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Convert minutes to time string
const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

// Generate start times: operating hours ke andar 15 min intervals
const generateStartTimes = (opening: string, closing: string) => {
  const startMin = timeToMinutes(opening);
  const endMin = timeToMinutes(closing);
  const times: string[] = [];

  for (let minutes = startMin; minutes <= endMin; minutes += 15) {
    times.push(minutesToTime(minutes));
  }
  return times;
};

// Generate end times = start + 15 min increments, lekin closing time se zyada nahi
const generateEndTimes = (start: string, closing: string) => {
  const startMin = timeToMinutes(start);
  const closingMin = timeToMinutes(closing);
  const endTimes: string[] = [];

  for (let minutes = startMin + 15; minutes <= closingMin; minutes += 15) {
    endTimes.push(minutesToTime(minutes));
  }
  return endTimes;
};

const SlotFormModal = ({
  visible,
  selectedCell,
  editingSlot,
  onClose,
  onNavigateToClassrooms,
  selectedBatch = "Batch",
  selectedBatchId = "",
  batchData,
  onSuccess,
  weekStart,
  selectedOrganization: propSelectedOrganization,
}: SlotFormModalProps) => {
  console.log("📋 === SLOT FORM MODAL RENDERED ===");
  console.log("📋 visible:", visible);
  console.log("📋 editingSlot prop:", editingSlot);
  console.log("📋 selectedCell:", selectedCell);
  
  // ⭐ TEACHER LIST API
  const { data: teacherData } = useTeachersListQuery();

  // ⭐ CLASSROOM LIST API
  const { data: classroomData } = useGetClassroomListQuery();

  // ⭐ Selected batch info + courseId
  const selectedBatchInfo = useMemo(() => {
    if (batchData?.statusCode === 200 && Array.isArray(batchData.data) && selectedBatchId) {
      return batchData.data.find((b: any) => b.batchId === selectedBatchId) || null;
    }
    return null;
  }, [batchData, selectedBatchId]);

  const courseId = selectedBatchInfo?.courses?.[0]?.courseId || "";

  // ⭐ COURSE DETAIL API (subjects ke liye)
  const { data: courseDetailData } = useCourseDetailsQuery(
    { courseId: courseId || "" },
    { enabled: !!courseId }
  );

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [customSubjects, setCustomSubjects] = useState<{ value: string; label: string }[]>([]);
  const [addSubjectModalVisible, setAddSubjectModalVisible] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [pendingSubjects, setPendingSubjects] = useState<string[]>([]);
  const [subjectModalStep, setSubjectModalStep] = useState<"select" | "create">("select");
  const [tempSubjectSelection, setTempSubjectSelection] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState(true);

  // ⭐ TEACHER OPTIONS for Picker
  const teacherOptions = useMemo(() => {
    if (teacherData?.statuscode === 200 && Array.isArray(teacherData.data)) {
      return teacherData.data.map((t: any) => ({
        value: t.teacherId,
        label: `${t.teacherFirstName} ${t.teacherLastName || ""}`.trim(),
      }));
    }
    return [];
  }, [teacherData]);

  // ⭐ CLASSROOM OPTIONS for Picker
  const classroomOptions = useMemo(() => {
    if (classroomData?.statusCode === 200 && classroomData.data?.classRooms) {
      return classroomData.data.classRooms.map((room: any) => ({
        value: room.classRoomId,
        label: room.classRoomName,
      }));
    }
    return [];
  }, [classroomData]);

  // ⭐ SUBJECT OPTIONS from Course Detail API
  const subjectOptions = useMemo(() => {
    if (courseDetailData?.data?.subjects && Array.isArray(courseDetailData.data.subjects)) {
      return courseDetailData.data.subjects.map((s: any) => ({
        value: s.subjectId,
        label: s.subjectName,
      }));
    }
    return [];
  }, [courseDetailData]);

  const courseName = courseDetailData?.data?.courseName || selectedBatchInfo?.courses?.[0]?.courseName || "Course";
  const batchName = selectedBatchInfo?.batchName || selectedBatch || "Batch";

  const combinedSubjectOptions = useMemo(
    () => [...subjectOptions, ...customSubjects],
    [subjectOptions, customSubjects]
  );

  // ⭐ OPERATING HOURS
  const DEFAULT_HOURS = { openingTime: "09:00", closingTime: "18:00" };
  const operatingHours = useMemo(() => {
    const opening =
      classroomData?.data?.openingTime ??
      classroomData?.data?.operatingHours?.openingTime ??
      DEFAULT_HOURS.openingTime;
    const closing =
      classroomData?.data?.closingTime ??
      classroomData?.data?.operatingHours?.closingTime ??
      DEFAULT_HOURS.closingTime;
    return { openingTime: opening, closingTime: closing };
  }, [classroomData]);

  // ⭐ START TIMES (operating hours ke andar 15 min intervals)
  const startTimes = useMemo(
    () => generateStartTimes(operatingHours.openingTime, operatingHours.closingTime),
    [operatingHours]
  );

  // ⭐ END TIMES (start time se 15 min increments, closing time se zyada nahi)
  const endTimes = useMemo(() => {
    if (!startTime) return [];
    return generateEndTimes(startTime, operatingHours.closingTime);
  }, [startTime, operatingHours.closingTime]);

  // ⭐ Reset endTime when startTime changes
  useEffect(() => {
    if (startTime) {
      setEndTime("");
    }
  }, [startTime]);

  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2]); // M T W default

  // ⭐ Check if in edit mode (declare early so it can be used in useEffect)
  const isEditMode = !!editingSlot;

  // ⭐ Prefill form when editingSlot exists
  useEffect(() => {
    console.log("📝 === SLOT FORM MODAL EFFECT ===");
    console.log("📝 visible:", visible);
    console.log("📝 editingSlot:", editingSlot ? JSON.stringify(editingSlot, null, 2) : "null");
    console.log("📝 isEditMode:", isEditMode);
    
    if (editingSlot && visible) {
      console.log("📝 Prefilling form with editingSlot");
      console.log("📝 Subject ID:", editingSlot.subjectId);
      console.log("📝 Teacher ID:", editingSlot.teacherId);
      console.log("📝 Room ID:", editingSlot.classRoomId);
      console.log("📝 Start Time:", editingSlot.startTime);
      console.log("📝 End Time:", editingSlot.endTime);
      console.log("📝 Day:", editingSlot.day);
      
      // Set values immediately - Picker will update when options are available
      setSelectedSubject(editingSlot.subjectId || "");
      setSelectedTeacher(editingSlot.teacherId || "");
      setSelectedRoom(editingSlot.classRoomId || "");
      setStartTime(editingSlot.startTime || "");
      setEndTime(editingSlot.endTime || "");
      setRepeat(false); // Single day for edit mode
      
      // Set active day based on editingSlot.day
      if (editingSlot.day) {
        const dayDate = editingSlot.day instanceof Date ? editingSlot.day : new Date(editingSlot.day);
        const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        // Convert to our day index (0 = Monday)
        const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        console.log("📝 Day of week:", dayOfWeek, "Adjusted index:", adjustedIndex);
        setActiveDays([adjustedIndex]);
      }
      
      console.log("✅ Form values set:", {
        subject: editingSlot.subjectId,
        teacher: editingSlot.teacherId,
        room: editingSlot.classRoomId,
        startTime: editingSlot.startTime,
        endTime: editingSlot.endTime,
      });
    } else if (!editingSlot && visible) {
      console.log("📝 Resetting form for new slot");
      // Reset form when opening for new slot
      setSelectedSubject("");
      setSelectedTeacher("");
      setSelectedRoom("");
      setStartTime("");
      setEndTime("");
      setRepeat(true);
      setActiveDays([0, 1, 2]);
    }
  }, [editingSlot, visible, isEditMode]);

  // ⭐ Log state values when they change (for debugging)
  useEffect(() => {
    if (visible && isEditMode) {
      console.log("📊 Current form state:", {
        selectedSubject,
        selectedTeacher,
        selectedRoom,
        startTime,
        endTime,
        activeDays,
        subjectOptionsCount: subjectOptions.length,
        teacherOptionsCount: teacherOptions.length,
        classroomOptionsCount: classroomOptions.length,
      });
    }
  }, [visible, isEditMode, selectedSubject, selectedTeacher, selectedRoom, startTime, endTime, activeDays, subjectOptions.length, teacherOptions.length, classroomOptions.length]);

  useEffect(() => {
    if (addSubjectModalVisible) {
      setSubjectModalStep("select");
      setTempSubjectSelection(selectedSubject || "");
    } else {
      setPendingSubjects([]);
      setNewSubjectName("");
    }
  }, [addSubjectModalVisible, selectedSubject]);

  const toggleDay = (index: number) => {
    setActiveDays((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleAddPendingSubject = () => {
    const trimmed = newSubjectName.trim();
    if (!trimmed) {
      return;
    }
    if (pendingSubjects.some((name) => name.toLowerCase() === trimmed.toLowerCase())) {
      Alert.alert("Duplicate", "Subject already added in list.");
      return;
    }
    setPendingSubjects((prev) => [...prev, trimmed]);
    setNewSubjectName("");
  };

  const handleRemovePendingSubject = (name: string) => {
    setPendingSubjects((prev) => prev.filter((item) => item !== name));
  };

  const handleSubmitNewSubjects = () => {
    if (pendingSubjects.length === 0) {
      return;
    }
    const created = pendingSubjects.map((name, index) => ({
      value: `temp-${Date.now()}-${index}-${name}`,
      label: name,
    }));
    setCustomSubjects((prev) => [...prev, ...created]);
    const last = created[created.length - 1];
    setSelectedSubject(last.value);
    setPendingSubjects([]);
    setNewSubjectName("");
    setAddSubjectModalVisible(false);
    Alert.alert("Subject added", "New subject has been added locally.");
  };

  const handleRoomPlusPress = () => {
    onClose();
    requestAnimationFrame(() => {
      onNavigateToClassrooms?.();
    });
  };

  // ⭐ REDUX: Organization data (use prop if provided, else from Redux)
  const reduxOrganization = useSelector((state: RootState) => state.auth.selectedOrganization);
  const selectedOrganization = propSelectedOrganization || reduxOrganization;

  // ⭐ MUTATION: Create and Update TimeTable
  const createMutation = useCreateTimeTableMutation();
  const updateMutation = useUpdateTimeTableMutation();
  const queryClient = useQueryClient();

  // ⭐ HANDLE ADD/UPDATE SLOT
  const handleAddSlot = () => {
    const action = isEditMode ? "UPDATE" : "ADD";
    console.log(`🔵 === ${action} SLOT CLICKED ===`);
    console.log("Form Values:", {
      selectedSubject,
      selectedTeacher,
      selectedRoom,
      startTime,
      endTime,
      selectedBatchId,
      repeat,
      activeDays,
      selectedCell: selectedCell ? "exists" : "null",
      editingSlot: editingSlot ? "exists" : "null",
    });

    // Validation
    if (!selectedSubject) {
      console.log("❌ Validation failed: Subject not selected");
      Alert.alert("Error", "Please select a subject");
      return;
    }
    if (!selectedTeacher) {
      console.log("❌ Validation failed: Teacher not selected");
      Alert.alert("Error", "Please select a teacher");
      return;
    }
    if (!selectedRoom) {
      console.log("❌ Validation failed: Room not selected");
      Alert.alert("Error", "Please select a room");
      return;
    }
    if (!startTime) {
      console.log("❌ Validation failed: Start time not selected");
      Alert.alert("Error", "Please select start time");
      return;
    }
    if (!endTime) {
      console.log("❌ Validation failed: End time not selected");
      Alert.alert("Error", "Please select end time");
      return;
    }
    if (!selectedBatchId) {
      console.log("❌ Validation failed: Batch ID not found");
      Alert.alert("Error", "Batch not selected");
      return;
    }
    if (repeat && activeDays.length === 0) {
      console.log("❌ Validation failed: No days selected");
      Alert.alert("Error", "Please select at least one day");
      return;
    }
    if (!repeat && !selectedCell) {
      console.log("❌ Validation failed: No cell selected and repeat is off");
      Alert.alert("Error", "Please select a cell or enable repeat");
      return;
    }

    console.log("✅ All validations passed");

    // Build slot object
    const slotObject = {
      subjectId: selectedSubject,
      teacherId: selectedTeacher,
      classRoomId: selectedRoom,
      startTime: startTime,
      endTime: endTime,
    };

    // Build repeatDays payload
    // If repeat is false, use only the selected cell's day
    let daysToUse: string[] = []; // Changed to string array for day keys
    if (repeat) {
      // Convert activeDays indices to actual day keys based on weekStart
      if (weekStart) {
        daysToUse = activeDays.map((dayIndex) => {
          // dayIndex is 0-based from Monday (0=M, 1=T, 2=W, 3=Th, 4=F, 5=Sa, 6=Su)
          // Get actual date for this day
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + dayIndex);
          // Use getDay() to get day of week (0=Sunday, 1=Monday, etc.)
          const dayOfWeek = dayDate.getDay();
          // Map to day keys: 0=Su, 1=M, 2=T, 3=W, 4=Th, 5=F, 6=Sa
          const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
          return dayKeys[dayOfWeek];
        });
      } else {
        // Fallback: use DAY_KEYS directly
        daysToUse = activeDays.map((dayIndex) => DAY_KEYS[dayIndex]);
      }
    } else if (isEditMode && editingSlot?.day) {
      // In edit mode, use editingSlot's day
      const dayOfWeek = editingSlot.day.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
      daysToUse = [dayKeys[dayOfWeek]];
    } else if (selectedCell) {
      // Get day key from selectedCell's date
      const dayOfWeek = selectedCell.day.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayKeys = ["Su", "M", "T", "W", "Th", "F", "Sa"];
      daysToUse = [dayKeys[dayOfWeek]];
    }

    // Final validation: ensure we have at least one day
    if (daysToUse.length === 0) {
      Alert.alert("Error", "Please select at least one day");
      return;
    }

    let payload: any;

    // For UPDATE: Use flat structure like web (simple object with repeatDays array)
    if (isEditMode && editingSlot) {
      // Clean the ID - remove any extra quotes or whitespace
      let slotId = (editingSlot.id || editingSlot.slotId || "").toString();
      // Remove quotes from start and end only (not from middle)
      slotId = slotId.replace(/^["']+|["']+$/g, "").trim();
      
      console.log("✏️ Edit mode - Slot ID:", slotId);
      console.log("✏️ Original ID from editingSlot:", editingSlot.id);
      
      if (!slotId) {
        Alert.alert("Error", "Slot ID is missing. Cannot update slot.");
        return;
      }

      // Convert day keys to day indices (like web: [0, 1, 2] for M, T, W)
      // Web uses: 0=Monday, 1=Tuesday, etc.
      const dayKeyToIndex: Record<string, number> = {
        "M": 0,
        "T": 1,
        "W": 2,
        "Th": 3,
        "F": 4,
        "Sa": 5,
        "Su": 6,
      };
      const repeatDaysArray = daysToUse
        .map(dayKey => dayKeyToIndex[dayKey])
        .filter(idx => idx !== undefined);

      // Build flat payload like web version
      payload = {
        customerId: selectedOrganization?.customerId,
        organizationId: selectedOrganization?.organizationId,
        batchId: selectedBatchId,
        id: slotId,
        subjectId: selectedSubject,
        teacherId: selectedTeacher,
        classRoomId: selectedRoom,
        startTime: startTime,
        endTime: endTime,
        repeatDays: repeatDaysArray, // Array of day indices, not nested object
        startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
        endDate: weekStart ? (() => {
          const end = new Date(weekStart);
          end.setDate(weekStart.getDate() + 6);
          return end.toISOString().split('T')[0];
        })() : "",
      };
      
      console.log("✏️ Update payload (flat structure like web):", JSON.stringify(payload, null, 2));
    } else {
      // For CREATE: Use FLAT structure like web (not nested)
      // Convert day keys to day indices (0=Monday, 1=Tuesday, etc.)
      const dayKeyToIndex: Record<string, number> = {
        "M": 0,
        "T": 1,
        "W": 2,
        "Th": 3,
        "F": 4,
        "Sa": 5,
        "Su": 6,
      };
      const repeatDaysArray = daysToUse
        .map(dayKey => dayKeyToIndex[dayKey])
        .filter(idx => idx !== undefined);

      // Build flat payload like web version
      payload = {
        customerId: selectedOrganization?.customerId,
        organizationId: selectedOrganization?.organizationId,
        batchId: selectedBatchId,
        subjectId: selectedSubject,
        teacherId: selectedTeacher,
        classRoomId: selectedRoom,
        startTime: startTime,
        endTime: endTime,
        repeatDays: repeatDaysArray, // Array of day indices, not nested object
        startDate: weekStart ? weekStart.toISOString().split('T')[0] : "",
        endDate: weekStart ? (() => {
          const end = new Date(weekStart);
          end.setDate(weekStart.getDate() + 6);
          return end.toISOString().split('T')[0];
        })() : "",
      };
      
      console.log("📦 CREATE payload (flat structure like web):", JSON.stringify(payload, null, 2));
    }

    console.log(`📦 Final Payload (${isEditMode ? "UPDATE" : "CREATE"}):`, JSON.stringify(payload, null, 2));
    console.log("📦 Organization:", {
      customerId: selectedOrganization?.customerId,
      organizationId: selectedOrganization?.organizationId,
    });

    // Call API
    const mutation = isEditMode ? updateMutation : createMutation;
    console.log(`🚀 Calling ${isEditMode ? "updateMutation" : "createMutation"}.mutate...`);
    mutation.mutate(payload, {
      onSuccess: (response) => {
        console.log(`✅ TimeTable ${isEditMode ? "updated" : "created"} successfully:`, response);
        console.log("📝 Response type:", typeof response);
        console.log("📝 Response stringified:", JSON.stringify(response));
        console.log("📝 Response data:", response?.data);
        console.log("📝 Response statusCode:", response?.statusCode);
        console.log("📝 Response message:", response?.message);
        
        // Check for error responses (404, etc.) - If axios returns error as response
        if (response?.status === 404 || response?.data?.statusCode === 404) {
          console.error("❌ 404 Error: Resource not found (caught in onSuccess)");
          // Throw error so it goes to onError handler for proper handling
          throw new Error(response?.data?.message || "API endpoint not found (404). Please check the backend service.");
        }
        
        // Check if response is empty string (backend returns "" but saves data like web)
        const isEmptyResponse = typeof response === "string" && response === "";
        const hasNoData = !response?.data && !response?.statusCode;
        
        if (isEmptyResponse) {
          console.log("ℹ️ Backend returned empty string (like web), but data should be saved");
          // Don't show warning - web me bhi same response aata hai and it works
          // Proceed with refetch - data should be saved
        } else if (hasNoData && !isEmptyResponse) {
          console.warn("⚠️ WARNING: Backend returned invalid response!");
          console.warn("⚠️ This might indicate the data was not saved properly.");
          
          // Show warning to user only if response is not empty string
          Alert.alert(
            "Warning",
            "Slot creation may have failed. Please check if the slot appears in the timetable. If not, please try again or contact support.",
            [
              {
                text: "OK",
                style: "default",
              },
            ]
          );
        }
        
        // Invalidate ALL timetable queries (with any params) to refresh grid
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey[0] === "timeTable";
          },
        });
        
        // If weekStart is provided, refetch with exact params
        if (weekStart && selectedOrganization && selectedBatchId) {
          const startWeekDate = weekStart.toISOString().split('T')[0];
          const endDate = new Date(weekStart);
          endDate.setDate(weekStart.getDate() + 6);
          const endWeekDate = endDate.toISOString().split('T')[0];
          
          const refetchParams = {
            customerId: selectedOrganization.customerId,
            organizationId: selectedOrganization.organizationId,
            batchId: selectedBatchId,
            startWeekDate: startWeekDate,
            endWeekDate: endWeekDate,
          };
          
          console.log("🔄 Refetching with params:", refetchParams);
          
          // Longer delay to ensure backend has fully processed and committed
          setTimeout(() => {
            console.log("🔄 Executing refetch now...");
            queryClient.refetchQueries({
              queryKey: ["timeTable", refetchParams],
            }).then(() => {
              console.log("✅ Refetch completed");
            }).catch((err) => {
              console.error("❌ Refetch error:", err);
            });
          }, 2000); // Increased to 2 seconds
        } else {
          // Fallback: refetch all timeTable queries
          setTimeout(() => {
            queryClient.refetchQueries({
              predicate: (query) => {
                return query.queryKey[0] === "timeTable";
              },
            });
          }, 2000);
        }
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        // Close modal
        onClose();
        // Reset form
        setSelectedSubject("");
        setSelectedTeacher("");
        setSelectedRoom("");
        setStartTime("");
        setEndTime("");
        setActiveDays([0, 1, 2]);
      },
      onError: (error: any) => {
        console.error(`❌ Error ${isEditMode ? "updating" : "creating"} TimeTable:`, error);
        console.error("❌ Error details:", JSON.stringify(error, null, 2));
        console.error("❌ Error type:", typeof error);
        console.error("❌ Error message:", error?.message);
        console.error("❌ Error response:", error?.response);
        console.error("❌ Error status:", error?.response?.status);
        console.error("❌ Error statusCode:", error?.response?.data?.statusCode);
        console.error("❌ Error response message:", error?.response?.data?.message);
        console.error("❌ API URL that failed:", isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE);
        
        // Get error message from different possible locations
        const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isEditMode ? "update" : "create"} slot. Please try again.`;
        const is404 = error?.response?.status === 404 || 
                     error?.response?.data?.statusCode === 404 || 
                     error?.message?.includes("404") || 
                     error?.message?.includes("not found") ||
                     error?.message?.includes("Not Found");
        
        // Check for 404 specifically
        if (is404) {
          const apiUrl = isEditMode ? apiUrls.timetable.UPDATE_TIME_TABLE : apiUrls.timetable.CREATE_TIME_TABLE;
          Alert.alert(
            "404 - Resource Not Found",
            `The API endpoint was not found. Please check:\n\n1. API URL: ${apiUrl}\n2. Payload structure\n3. Backend service status\n\nError: ${errorMessage}`
          );
        } else {
          Alert.alert(
            "Error",
            errorMessage
          );
        }
      },
    });
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.backdrop}>
          <ScrollView
            style={styles.modalContainer}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
          {/* Title */}
          <Text style={styles.title}>
            {isEditMode ? "Edit Slot" : `Add New Slot for ${selectedBatch}`}
          </Text>

          {/* SUBJECT */}
          <Text style={styles.label}>Subject</Text>
          <View style={styles.row}>
            <View style={styles.dropdownBox}>
              <Picker selectedValue={selectedSubject} onValueChange={setSelectedSubject}>
                <Picker.Item label="Select subject" value={""} />
                {combinedSubjectOptions.map((subject: { value: string; label: string }) => (
                  <Picker.Item
                    key={subject.value}
                    label={subject.label}
                    value={subject.value}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.plusBtn}
              onPress={() => setAddSubjectModalVisible(true)}
            >
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* TEACHER */}
          <Text style={styles.label}>Teacher</Text>
          <View style={styles.row}>
            <View style={styles.dropdownBox}>
              <Picker selectedValue={selectedTeacher} onValueChange={setSelectedTeacher}>
                <Picker.Item label="Select teacher" value={""} />
                {teacherOptions.map((teacher: { value: string; label: string }) => (
                  <Picker.Item
                    key={teacher.value}
                    label={teacher.label}
                    value={teacher.value}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.plusBtn}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* ROOM */}
          <Text style={styles.label}>Room</Text>
          <View style={styles.row}>
            <View style={styles.dropdownBox}>
              <Picker selectedValue={selectedRoom} onValueChange={setSelectedRoom}>
                <Picker.Item label="Select room" value={""} />
                {classroomOptions.map((room: { value: string; label: string }) => (
                  <Picker.Item
                    key={room.value}
                    label={room.label}
                    value={room.value}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity style={styles.plusBtn} onPress={handleRoomPlusPress}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* START TIME */}
          <Text style={styles.label}>Start Time</Text>
          <View style={styles.dropdownBox}>
            <Picker
              selectedValue={startTime}
              onValueChange={(val) => setStartTime(val)}
            >
              <Picker.Item label="Select start time" value={""} />
              {startTimes.map((t) => (
                <Picker.Item key={t} label={t} value={t} />
              ))}
            </Picker>
          </View>

          {/* END TIME */}
          <Text style={styles.label}>End Time</Text>
          <View style={styles.dropdownBox}>
            <Picker
              selectedValue={endTime}
              onValueChange={(val) => setEndTime(val)}
              enabled={!!startTime}
            >
              <Picker.Item label="Select end time" value={""} />
              {endTimes.map((t) => (
                <Picker.Item key={t} label={t} value={t} />
              ))}
            </Picker>
          </View>

          {/* REPEAT TOGGLE */}
          <View style={styles.repeatRow}>
            <Text style={styles.repeatLabel}>Repeat this slot</Text>
            <Switch
              value={repeat}
              onValueChange={setRepeat}
              thumbColor="#FFF"
              trackColor={{ true: COLORS.primary, false: "#CCC" }}
            />
          </View>

          {/* SELECT DAYS */}
          {/* SELECT DAYS (Visible only when REPEAT = true) */}
{repeat && (
  <>
    <Text style={styles.label}>Select days</Text>

    <View style={styles.daysRow}>
      {DAY_KEYS.map((d, i) => {
        const isActive = activeDays.includes(i);
        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.dayCircle,
              isActive && { backgroundColor: PURPLE },
            ]}
            onPress={() => toggleDay(i)}
          >
            <Text
              style={[
                styles.dayText,
                isActive && { color: "#FFF", fontWeight: "700" },
              ]}
            >
              {d}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </>
)}


          {/* FOOTER BUTTONS */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, (isEditMode ? updateMutation : createMutation).isPending && styles.saveBtnDisabled]}
              onPress={() => {
                console.log("🟢 BUTTON CLICKED!");
                handleAddSlot();
              }}
              disabled={(isEditMode ? updateMutation : createMutation).isPending}
            >
              <Text style={styles.saveBtnText}>
                {(isEditMode ? updateMutation : createMutation).isPending 
                  ? (isEditMode ? "Updating..." : "Adding...") 
                  : (isEditMode ? "UPDATE SLOT" : "ADD SLOT +")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>

      <Modal
        visible={addSubjectModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddSubjectModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.addSubjectBackdrop}
          activeOpacity={1}
          onPress={() => setAddSubjectModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.addSubjectCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.addSubjectHeader}>
              <Text style={styles.addSubjectTitle}>Add Subject</Text>
              <TouchableOpacity onPress={() => setAddSubjectModalVisible(false)}>
                <Text style={styles.addSubjectClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.addSubjectMeta}>
              <Text style={styles.addSubjectMetaLabel}>Course: </Text>
              {courseName}
            </Text>
            <Text style={styles.addSubjectMeta}>
              <Text style={styles.addSubjectMetaLabel}>Batch: </Text>
              {batchName}
            </Text>

            {subjectModalStep === "select" ? (
              <>
                <View style={styles.selectDropdownBox}>
                  <Picker
                    selectedValue={tempSubjectSelection}
                    onValueChange={(val) => setTempSubjectSelection(val)}
                  >
                    <Picker.Item label="Select subject" value="" />
                    {combinedSubjectOptions.map((subject) => (
                      <Picker.Item
                        key={`modal-subject-${subject.value}`}
                        label={subject.label}
                        value={subject.value}
                      />
                    ))}
                  </Picker>
                </View>

                <ScrollView style={styles.subjectList} nestedScrollEnabled>
                  {combinedSubjectOptions.map((subject) => {
                    const isActive = tempSubjectSelection === subject.value;
                    return (
                      <TouchableOpacity
                        key={`modal-option-${subject.value}`}
                        style={styles.subjectOptionRow}
                        onPress={() => setTempSubjectSelection(subject.value)}
                      >
                        <View style={[styles.subjectCheckbox, isActive && styles.subjectCheckboxActive]}>
                          {isActive && <Text style={styles.subjectCheckboxTick}>✓</Text>}
                        </View>
                        <Text style={styles.subjectOptionLabel}>{subject.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity style={styles.createLinkRow} onPress={() => setSubjectModalStep("create")}>
                  <Text style={styles.createLinkIcon}>＋</Text>
                  <Text style={styles.createLinkText}>Create New Subject</Text>
                </TouchableOpacity>

                <View style={styles.addSubjectFooter}>
                  <TouchableOpacity
                    style={styles.addSubjectCancel}
                    onPress={() => setAddSubjectModalVisible(false)}
                  >
                    <Text style={styles.addSubjectCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.addSubjectSubmit,
                      !tempSubjectSelection && styles.addSubjectSubmitDisabled,
                    ]}
                    disabled={!tempSubjectSelection}
                    onPress={() => {
                      if (tempSubjectSelection) {
                        setSelectedSubject(tempSubjectSelection);
                        setAddSubjectModalVisible(false);
                      }
                    }}
                  >
                    <Text style={styles.addSubjectSubmitText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.addSubjectInputRow}>
                  <TextInput
                    style={styles.addSubjectTextInput}
                    placeholder="Enter new subject name"
                    value={newSubjectName}
                    onChangeText={setNewSubjectName}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity style={styles.addSubjectAddBtn} onPress={handleAddPendingSubject}>
                    <Text style={styles.addSubjectAddText}>＋ ADD</Text>
                  </TouchableOpacity>
                </View>

                {pendingSubjects.length > 0 ? (
                  <View style={styles.pendingList}>
                    {pendingSubjects.map((name) => (
                      <View key={name} style={styles.pendingItem}>
                        <View style={styles.pendingHeader}>
                          <Text style={styles.pendingTitle}>{name}</Text>
                          <TouchableOpacity onPress={() => handleRemovePendingSubject(name)}>
                            <Text style={styles.pendingRemove}>✕</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.pendingTimeRow}>
                          <TextInput style={styles.pendingTimeInput} placeholder="Start time" editable={false} />
                          <TextInput style={styles.pendingTimeInput} placeholder="End time" editable={false} />
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.addSubjectEmpty}>Subjects you add will appear here.</Text>
                )}

                <View style={styles.addSubjectFooter}>
                  <TouchableOpacity
                    style={styles.addSubjectCancel}
                    onPress={() => {
                      setSubjectModalStep("select");
                      setPendingSubjects([]);
                      setNewSubjectName("");
                    }}
                  >
                    <Text style={styles.addSubjectCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.addSubjectSubmit,
                      pendingSubjects.length === 0 && styles.addSubjectSubmitDisabled,
                    ]}
                    disabled={pendingSubjects.length === 0}
                    onPress={handleSubmitNewSubjects}
                  >
                    <Text style={styles.addSubjectSubmitText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default SlotFormModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    maxHeight: "92%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  dropdownBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#C9D4F1",
    borderRadius: 10,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: "#0B4DA2",
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: "#0B4DA2",
    fontSize: 22,
    fontWeight: "700",
  },
  repeatRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  repeatLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  daysRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#C9D4F1",
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    color: "#444",
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 10,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },
  cancelText: { fontSize: 15, fontWeight: "600", color: "#111" },
  saveBtn: {
    flex: 1,
    marginLeft: 10,
    padding: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  addSubjectBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  addSubjectCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
  },
  addSubjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addSubjectTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  addSubjectClose: {
    fontSize: 18,
    color: "#6B7280",
  },
  addSubjectMeta: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  addSubjectMetaLabel: {
    fontWeight: "600",
    color: "#111827",
  },
  selectDropdownBox: {
    borderWidth: 1,
    borderColor: "#C9D4F1",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },
  subjectList: {
    maxHeight: 220,
    marginTop: 12,
  },
  subjectOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  subjectCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  subjectCheckboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(107,87,242,0.15)",
  },
  subjectCheckboxTick: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  subjectOptionLabel: {
    color: "#111827",
    fontSize: 14,
  },
  createLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  createLinkIcon: {
    color: COLORS.primary,
    fontSize: 18,
    marginRight: 6,
  },
  createLinkText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  addSubjectInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  addSubjectTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
  },
  addSubjectAddBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#16A34A",
    backgroundColor: "rgba(34,197,94,0.1)",
  },
  addSubjectAddText: {
    color: "#16A34A",
    fontWeight: "700",
  },
  pendingList: {
    marginTop: 16,
  },
  pendingItem: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  pendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pendingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  pendingRemove: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  pendingTimeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  pendingTimeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#9CA3AF",
  },
  addSubjectEmpty: {
    textAlign: "center",
    color: "#9CA3AF",
    marginVertical: 24,
  },
  addSubjectFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  addSubjectCancel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  addSubjectCancelText: {
    color: "#6B7280",
    fontWeight: "600",
  },
  addSubjectSubmit: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  addSubjectSubmitDisabled: {
    backgroundColor: "#CBD5F5",
  },
  addSubjectSubmitText: {
    color: "#FFF",
    fontWeight: "700",
  },
});


